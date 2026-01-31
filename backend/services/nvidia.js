const axios = require('axios');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

// NVIDIA Base URLs
const EMBED_URL = 'https://ai.api.nvidia.com/v1/retrieval/nvidia/embeddings';
const RERANK_URL = 'https://ai.api.nvidia.com/v1/retrieval/nvidia/reranking';

/**
 * NVIDIA NIM을 사용하여 임베딩 생성 (nvidia/nv-embed-qa-4)
 */
async function generateEmbeddings(texts, inputType = 'passage') {
  try {
    const response = await axios.post(
      EMBED_URL,
      {
        input: texts,
        model: 'nvidia/nv-embed-qa-4',
        input_type: inputType,
        encoding_format: 'float',
        truncate: 'END'
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data.map(item => item.embedding);
  } catch (error) {
    console.error('NVIDIA Embedding Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * NVIDIA NIM을 사용하여 문서 Reranking 진행 (nv-rerankqa-mistral-4b-v3)
 */
async function rerankDocuments(query, documents) {
  try {
    const response = await axios.post(
      RERANK_URL,
      {
        model: 'nvidia/nv-rerankqa-mistral-4b-v3',
        query: { text: query },
        passages: documents.map(doc => ({ text: doc.text }))
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.rankings;
  } catch (error) {
    console.error('NVIDIA Rerank Error:', error.response?.data || error.message);
    throw error; 
  }
}

module.exports = {
  generateEmbeddings,
  rerankDocuments
};
