const express = require('express');
const router = express.Router();
const { rerankDocuments } = require('../services/nvidia');
const { getKnowledgeBaseChunks } = require('../services/local_rag');

// POST /api/rag/ask (Testing Endpoint)
// Body: { query: string }
router.post('/ask', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`Searching for: "${query}"`);

    // Load All Chunks
    const allDocuments = getKnowledgeBaseChunks();
    console.log(`${allDocuments.length}개 전체 문서에 대해 NVIDIA Reranking 진행... (No-DB)`);
    
    // NVIDIA Reranking
    if (allDocuments.length === 0) {
        return res.json({ answer: "지식 베이스가 비어있습니다.", context: [] });
    }

    const rerankedIndices = await rerankDocuments(query, allDocuments);
    
    // 점수(Logit)가 높은 순서대로 정렬됨
    // Top 3 (관련성 높음)
    const topResults = rerankedIndices.slice(0, 3).map(item => ({
        score: item.logit,
        title: allDocuments[item.index].metadata.title,
        text_snippet: allDocuments[item.index].text.substring(0, 60) + "..."
    }));

    // Bottom 3 (관련성 낮음 -> NVIDIA가 걸러낸 것)
    const bottomResults = rerankedIndices.slice(-3).map(item => ({
        score: item.logit,
        title: allDocuments[item.index].metadata.title,
        text_snippet: allDocuments[item.index].text.substring(0, 60) + "..."
    }));

    // [데모용] 결과 반환
    res.json({
        query,
        comparison: {
            description: "NVIDIA Reranking Score 비교 (높을수록 관련성 높음)",
            selected_context_scores: topResults, // AI에게 주입된 지식 (점수 높음)
            filtered_out_scores: bottomResults   // AI에게 주입되지 않고 버려진 지식 (점수 낮음)
        },
        final_context: topResults.map(r => ({ ...r, full_text: allDocuments[rerankedIndices.find(x => x.index === allDocuments.findIndex(d => d.metadata.title === r.title))?.index]?.text }))
    });

  } catch (error) {
    console.error('RAG Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
