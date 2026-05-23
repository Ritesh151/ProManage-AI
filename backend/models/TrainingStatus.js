const mongoose = require('mongoose');

const trainingStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['idle', 'running', 'completed', 'failed'],
    default: 'idle',
  },
  progress: { type: Number, default: 0 },
  currentStep: { type: String, default: '' },
  filesIndexed: { type: Number, default: 0 },
  chunksCreated: { type: Number, default: 0 },
  embeddings: { type: Number, default: 0 },
  lastTraining: { type: Date },
  successRate: { type: Number, default: 0 },
  isTraining: { type: Boolean, default: false },
  error: { type: String },
  startedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('TrainingStatus', trainingStatusSchema);
