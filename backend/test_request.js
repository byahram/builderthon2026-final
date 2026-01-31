const axios = require('axios');

async function testTalk() {
  try {
    console.log('Testing /api/talk endpoint...');
    const response = await axios.post('http://localhost:3000/api/talk', {
      category: "business",
      goal: "Test Goal",
      experience: "novice",
      motivation: "money",
      duration: 3,
      persona: "steve",
      startDate: "2026-02-01"
    });
    
    console.log('✅ Success! Status:', response.status);
    console.log('Roadmap:', JSON.stringify(response.data.roadmap[0], null, 2));
    if (response.data.rag_comparison) {
        console.log('✅ RAG Data Present');
    }
  } catch (error) {
    console.error('❌ Request Failed');
    if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
        console.error('Error:', error.message);
    }
  }
}

testTalk();
