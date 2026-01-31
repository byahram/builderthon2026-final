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

    // Build the prompt for Claude to generate roadmap
    const systemMessage = `You are an expert learning roadmap generator. Your task is to create a beginner-to-intermediate friendly daily roadmap based on the user's input.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no explanations, no text outside the JSON object.

The JSON must have this exact structure:
{
  "roadmap": [
    {
      "day": 1,
      "title": "Short, clear, one-line goal for the day",
      "difficulty": "novice" | "easy" | "medium" | "hard",
      "completed": false,
      "feedback": null,
      "uploadedFile": null
    }
  ],
  "ai_message": "Short (1-3 sentences), encouraging message that matches the persona. Address the user directly."
}

Rules:
- Create exactly ${duration} days in the roadmap array
- Each day must have a clear, actionable title
- Set appropriate difficulty levels based on the user's experience level
- The ai_message should match the persona (${persona}) and be encouraging
- completed, feedback, and uploadedFile should always be false/null initially
- Respond with ONLY the JSON object, nothing else`;

    const userMessage = `Create a ${duration}-day roadmap for:
- Category: ${category}
- Experience level: ${experience}
- Motivation: ${motivation}
- Persona: ${persona}
- Goal: ${goal}
- Start date: ${startDate}

Remember: Output ONLY valid JSON, no other text.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemMessage,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // Extract the response text
    let responseText = message.content[0].text.trim();

    // Try to extract JSON if Claude wrapped it in markdown code blocks
    if (responseText.startsWith('```')) {
      const jsonMatch = responseText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        responseText = jsonMatch[1].trim();
      }
    }

    // Parse the JSON response
    let roadmapData;
    try {
      roadmapData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', responseText);
      return res.status(500).json({
        error: 'Failed to generate valid roadmap JSON',
        details: parseError.message
      });
    }

    // Validate the structure
    if (!roadmapData.roadmap || !Array.isArray(roadmapData.roadmap)) {
      return res.status(500).json({
        error: 'Invalid roadmap structure: missing or invalid roadmap array'
      });
    }

    if (!roadmapData.ai_message || typeof roadmapData.ai_message !== 'string') {
      return res.status(500).json({
        error: 'Invalid roadmap structure: missing or invalid ai_message'
      });
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
