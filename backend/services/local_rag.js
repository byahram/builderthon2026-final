const fs = require('fs');
const path = require('path');

// Load data once on startup
const dataPath = path.join(__dirname, '../data/lean_startup.json');
let cachedChunks = null;

function getKnowledgeBaseChunks() {
  if (cachedChunks) return cachedChunks;

  try {
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const chunks = [];

    // 1. Process "Steps"
    rawData.steps.forEach(step => {
        const text = `
Topic: ${rawData.topic}
Step ${step.step}: ${step.title}
Description: ${step.description}
Key Concepts: ${step.key_concepts.join(', ')}
Details: ${step.detailed_explanation}
Action Items: ${step.action_items.map(item => `- ${item.action}: ${item.details}`).join('\n')}
Success Criteria: ${step.success_criteria.join(', ')}
        `.trim();
    
        chunks.push({
            id: `step-${step.step}`,
            text: text,
            metadata: {
                title: step.title,
                step: step.step
            }
        });
    });

    // 2. Process "Resources"
    const resourcesText = `
Topic: ${rawData.topic} - Additional Resources
Recommended Books: ${rawData.additional_resources.recommended_books.join(', ')}
Tools: ${rawData.additional_resources.tools.join(', ')}
Key Frameworks: ${rawData.additional_resources.key_frameworks.join(', ')}
    `.trim();

    chunks.push({
        id: 'resources',
        text: resourcesText,
        metadata: { title: 'Additional Resources' }
    });

    console.log(`📚 Local Knowledge Base Loaded: ${chunks.length} chunks`);
    cachedChunks = chunks;
    return chunks;

  } catch (error) {
    console.error('Failed to load local RAG data:', error);
    return [];
  }
}

module.exports = { getKnowledgeBaseChunks };
