const SystemKnowledge = require('../models/SystemKnowledge');

const CATEGORY_EMOJI = {
  architecture: '🏗️',
  workflow: '📋',
  export: '📤',
  backend: '🖥️',
  frontend: '🎨',
  training: '🧠',
  proposal: '📄',
  general: '📌',
};

class AISystemKnowledgeService {
  async find(query) {
    if (!query || !String(query).trim()) return [];
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(t => t.length > 2);

    const results = await SystemKnowledge.find({
      $or: [
        { keywords: { $in: terms } },
        { title: new RegExp(terms.slice(0, 5).join('|'), 'i') },
        { content: new RegExp(terms.slice(0, 5).join('|'), 'i') },
      ],
    }).limit(5).lean();

    if (results.length) return results;

    if (terms.length >= 2) {
      const broad = await SystemKnowledge.find({
        $or: [
          { content: new RegExp(terms.slice(0, 3).join('|'), 'i') },
          { category: new RegExp(terms.slice(0, 3).join('|'), 'i') },
        ],
      }).limit(3).lean();
      if (broad.length) return broad;
    }

    return [];
  }

  async findByCategory(category) {
    return SystemKnowledge.find({ category }).limit(10).lean();
  }

  formatResponse(entries) {
    if (!entries?.length) return null;

    if (entries.length === 1) {
      return this._formatSingle(entries[0]);
    }

    return entries.map(e => this._formatSingle(e)).join('\n\n---\n\n');
  }

  formatProjectWorkflow() {
    return `📋 Project Workflow

1. Create project
  ↓
2. Store MongoDB data
  ↓
3. Calculate cost
  ↓
4. Generate proposal
  ↓
5. Export PDF/Excel
  ↓
6. AI indexing
  ↓
7. AI chatbot access`;
  }

  formatExportResponse(entry) {
    const title = entry.title || 'Export System';
    const lines = [
      `📄 ${title}`,
      '',
      entry.content,
    ];
    if (entry.category) lines.push('', `Category: ${entry.category}`);
    return lines.join('\n');
  }

  formatArchitectureResponse(entry) {
    const title = entry.title || 'Architecture';
    return [
      `🏗️ ${title}`,
      '',
      entry.content,
    ].join('\n');
  }

  _formatSingle(entry) {
    const emoji = CATEGORY_EMOJI[entry.category] || '📌';
    const lines = [
      `${emoji} ${entry.title}`,
      '',
      entry.content,
    ];
    return lines.join('\n');
  }
}

module.exports = new AISystemKnowledgeService();
