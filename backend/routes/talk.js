const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/talk endpoint
router.post('/talk', async (req, res) => {
  try {
    const { category, experience, motivation, duration, persona, goal, startDate } = req.body;

    // Validate required fields
    if (!category || !experience || !motivation || !duration || !persona || !goal || !startDate) {
      return res.status(400).json({
        error: 'Invalid request: all fields are required (category, experience, motivation, duration, persona, goal, startDate)'
      });
    }

    // Validate duration is a number
    if (typeof duration !== 'number' || duration < 1) {
      return res.status(400).json({
        error: 'Invalid request: duration must be a positive number'
      });
    }

    // --- RAG: RETRIEVAL START (No-DB Version) ---
    let ragContext = "";
    let ragComparison = null; 

    try {
      const { rerankDocuments } = require('../services/nvidia');
      const { getKnowledgeBaseChunks } = require('../services/local_rag');
      
      const ragQuery = `${category} related to ${goal} for ${experience} level`;
      
      // 1. Load All Chunks
      const allDocuments = getKnowledgeBaseChunks();
      
      if (allDocuments.length > 0) {
        // 2. NVIDIA Rerank Directly
        const rerankedIndices = await rerankDocuments(ragQuery, allDocuments);
        
        // 3. Take Top 3 (Selected)
        const topDocs = rerankedIndices.slice(0, 3).map(item => ({
            score: item.logit,
            title: allDocuments[item.index].metadata.title,
            text: allDocuments[item.index].text
        }));

        // Take Bottom 3 (Filtered Out)
        const bottomDocs = rerankedIndices.slice(-3).map(item => ({
            score: item.logit,
            title: allDocuments[item.index].metadata.title,
            text: allDocuments[item.index].text.substring(0, 50) + "..."
        }));

        ragContext = topDocs.map(doc => `[Reference: ${doc.title}]\n${doc.text}`).join('\n\n');
        
        // 비교 데이터 구성
        ragComparison = {
            query: ragQuery,
            description: "NVIDIA Rerank 결과 비교: AI가 선택한 맥락 vs 버린 맥락",
            selected: topDocs.map(d => ({ title: d.title, score: d.score })),
            rejected: bottomDocs.map(d => ({ title: d.title, score: d.score }))
        };

        console.log('RAG: Context retrieved via Rerank.');
      }
    } catch (ragError) {
      console.error('RAG Error:', ragError);
    }

    const systemMessage = `You are an expert learning roadmap generator. YOUR GOAL is to create a practical, step-by-step roadmap.

    ${ragContext ? `\nUse this context to guide the roadmap:\n\n${ragContext}\n\n` : ''}

CRITICAL: Respond with ONLY the following JSON structure. No markdown.
CRITICAL: All textual content (titles, messages) MUST be in KOREAN (한국어).

{
  "roadmap": [
    {
      "day": 1,
      "title": "Actionable title",
      "difficulty": "novice",
      "completed": false,
      "feedback": null,
      "uploadedFile": null
    }
  ],
  "ai_message": "Encouraging message matching the persona (${persona})."
}

Constraints:
- Create exactly ${duration} days
- Adjust difficulty to: ${experience}
- Persona style: ${persona}
- Output JSON only`;

    const userMessage = `Create a ${duration}-day roadmap for:
- Category: ${category}
- Experience level: ${experience}
- Motivation: ${motivation}
- Persona: ${persona}
- Goal: ${goal}
- Start date: ${startDate}

Remember: Output ONLY valid JSON, no other text.
Remember: Write EVERYTHING in KOREAN.`;

    // Call Claude API with Fallback
    let roadmapData;
    
    try {
        console.log('🚀 Sending request to Anthropic...');
        const message = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307', 
          max_tokens: 4096,
          system: systemMessage,
          messages: [{ role: 'user', content: userMessage }]
        });
        
        console.log('✅ Anthropic Response Received');

        // Extract the response text
        let responseText = message.content[0].text.trim();
        if (responseText.startsWith('```')) {
          const jsonMatch = responseText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
          if (jsonMatch) responseText = jsonMatch[1].trim();
        }
        
        roadmapData = JSON.parse(responseText);

    } catch (apiError) {
        console.error('❌ Anthropic API CRITICAL FAILURE ❌');
        console.error('Status Code:', apiError.status);
        console.error('Error Type:', apiError.type);
        console.error('Full Error Object:', JSON.stringify(apiError, null, 2));

        // Demo Fallback
        roadmapData = {
            roadmap: Array.from({ length: duration }, (_, i) => ({
                day: i + 1,
                title: `[Error: ${apiError.status}] Check Console for details`,
                difficulty: experience,
                completed: false,
                feedback: null,
                uploadedFile: null
            })),
            ai_message: `⚠️ API Error (See Backend Console): ${apiError.message}`
        };
    }

    // Add RAG Comparison Data to the response (for Demo/Debugging)
    if (ragComparison) {
        roadmapData.rag_comparison = ragComparison;
    }

    // Send the JSON response
    res.json(roadmapData);

  } catch (error) {
    console.error('Error processing talk request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
