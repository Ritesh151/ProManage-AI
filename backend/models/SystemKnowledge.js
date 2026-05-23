const mongoose = require('mongoose');

const systemKnowledgeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  keywords: [{ type: String, trim: true }],
  category: {
    type: String,
    enum: ['architecture', 'workflow', 'export', 'backend', 'frontend', 'training', 'proposal', 'general'],
    default: 'general',
  },
  content: { type: String, required: true },
}, { timestamps: true });

systemKnowledgeSchema.index({ title: 'text', keywords: 'text', content: 'text' });

module.exports = mongoose.model('SystemKnowledge', systemKnowledgeSchema);
