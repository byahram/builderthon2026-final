require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function test() {
  try {
    console.log('Testing Anthropic Key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing');
    // console.log('Key Value:', process.env.ANTHROPIC_API_KEY); // Don't print full key safely
    
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      messages: [{ role: "user", content: "Hello" }]
    });
    console.log('Success:', msg.content[0].text);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.status) console.error('Status:', err.status);
    if (err.error) console.error('Error Details:', err.error);
  }
}

test();
