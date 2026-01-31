require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

const cors = require('cors');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());

// History directory
const HISTORY_DIR = path.join(__dirname, 'history');

// Ensure history directory exists
async function ensureHistoryDir() {
  try {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating history directory:', error);
  }
}

// Import routes
const chatRoutes = require('./routes/chat');
const talkRoutes = require('./routes/talk');

// Mount routes
app.use('/api', chatRoutes);
app.use('/api', talkRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await ensureHistoryDir();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  - POST http://localhost:${PORT}/api/chat`);
    console.log(`  - POST http://localhost:${PORT}/api/talk`);
    console.log(`History files will be saved to: ${HISTORY_DIR}`);
  });
}

startServer();
