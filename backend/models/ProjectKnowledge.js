const mongoose = require('mongoose');

const projectKnowledgeSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  projectName: { type: String, required: true, index: true },
  knowledgeType: {
    type: String,
    enum: ['overview', 'technologies', 'proposal', 'scope', 'features', 'client', 'cost', 'timeline', 'description'],
    required: true,
  },
  content: { type: String, required: true },
  chunkIndex: { type: Number, default: 0 },
  embedding: { type: [Number], default: [] },
  tokens: [String],
  keywords: [String],
  metadata: {
    category: String,
    status: String,
    clientName: String,
    companyName: String,
    cost: Number,
    frontend: [String],
    backend: [String],
    database: [String],
    other: [String],
    scopeOfWork: [String],
    features: [String],
    timeline: String,
  },
}, { timestamps: true });

projectKnowledgeSchema.index({ projectName: 1, knowledgeType: 1 });
projectKnowledgeSchema.index({ tokens: 1 });
projectKnowledgeSchema.index({ keywords: 1 });
projectKnowledgeSchema.index({ content: 'text' });

module.exports = mongoose.model('ProjectKnowledge', projectKnowledgeSchema);
