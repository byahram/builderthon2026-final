const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// History directory
const HISTORY_DIR = path.join(__dirname, '..', 'history');

// Get current date for file naming
function getCurrentDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Append to history file
async function appendToHistory(prompt, workflow, response) {
  const dateStr = getCurrentDateString();
  const filename = `conversation-${dateStr}.md`;
  const filepath = path.join(HISTORY_DIR, filename);

  const timestamp = new Date().toISOString();

  let content = `\n## ${timestamp}\n\n`;
  content += `**User Prompt:**\n${prompt}\n\n`;

  if (workflow) {
    content += `**Workflow/Goal:**\n${workflow}\n\n`;
  }

  content += `**Claude Response:**\n${response}\n\n`;
  content += `---\n`;

  try {
    await fs.appendFile(filepath, content, 'utf8');
  } catch (error) {
    console.error('Error appending to history:', error);
    throw error;
  }
}

// POST /api/chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { prompt, workflow } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request: "prompt" is required and must be a string'
      });
    }

    // Build the system message based on whether workflow is provided
    let systemMessage = 'You are Claude, a helpful AI assistant.';
    let userMessage = prompt;

    if (workflow && typeof workflow === 'string') {
      systemMessage = 'You are Claude, a helpful AI assistant specialized in creating detailed action plans. When given a workflow or goal, create a comprehensive 7-day action plan with specific, actionable steps for each day.';
      userMessage = `Goal/Workflow: ${workflow}\n\nUser's message: ${prompt}\n\nPlease create a detailed 7-day action plan to achieve this goal. For each day, provide specific, actionable tasks.`;
    }

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
    const responseText = message.content[0].text;

    // Save to history
    await appendToHistory(prompt, workflow, responseText);

    // Send response
    res.json({
      response: responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
