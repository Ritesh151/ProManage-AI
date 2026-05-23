const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, default: 'anonymous', index: true },
  currentProject: {
    projectId: String,
    projectName: String,
  },
  currentClient: {
    clientName: String,
    companyName: String,
  },
  previousQuestions: [{ type: String }],
  lastIntent: { type: String },
  pendingIntent: { type: String },
  pendingOriginalQuestion: { type: String },
  recentEntities: {
    projectName: String,
    clientName: String,
    companyName: String,
    techLayer: String,
    lastIntent: String,
    updatedAt: Date,
  },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    intent: String,
    entities: mongoose.Schema.Types.Mixed,
    format: String,
    data: mongoose.Schema.Types.Mixed,
    confidence: Number,
    timestamp: { type: Date, default: Date.now },
  }],
  lastSelectedProject: {
    projectId: String,
    projectName: String,
  },
  recentQueries: [String],
  pinnedChats: { type: Boolean, default: false },
  pinnedProjects: [String],
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
}, { timestamps: true });

chatSessionSchema.index({ userId: 1, updatedAt: -1 });
chatSessionSchema.index({ userId: 1, isDeleted: 1, updatedAt: -1 });
chatSessionSchema.index({ pinnedChats: 1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
