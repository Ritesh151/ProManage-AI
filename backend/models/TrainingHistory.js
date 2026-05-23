const mongoose = require('mongoose');

const trainingHistorySchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
  type: { type: String, enum: ['full', 'retrain'], default: 'full' },
  totalProjects: { type: Number, default: 0 },
  filesIndexed: { type: Number, default: 0 },
  chunksCreated: { type: Number, default: 0 },
  embeddings: { type: Number, default: 0 },
  duration: { type: Number },
  successRate: { type: Number, default: 0 },
  trainingErrors: [{ projectName: String, error: String }],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
}, { timestamps: true, suppressReservedKeysWarning: true });

module.exports = mongoose.model('TrainingHistory', trainingHistorySchema);
