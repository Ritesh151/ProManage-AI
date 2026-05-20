/**
 * AI Training Session Model
 * Tracks training sessions and their progress
 */

const mongoose = require('mongoose');

const aiTrainingSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed', 'paused'],
    default: 'pending',
    index: true,
  },
  type: {
    type: String,
    enum: ['full', 'incremental', 'retrain'],
    default: 'full',
  },

  // Progress tracking
  totalProjects: {
    type: Number,
    default: 0,
  },
  projectsProcessed: {
    type: Number,
    default: 0,
  },
  totalFiles: {
    type: Number,
    default: 0,
  },
  filesProcessed: {
    type: Number,
    default: 0,
  },
  totalChunks: {
    type: Number,
    default: 0,
  },
  chunksCreated: {
    type: Number,
    default: 0,
  },
  embeddingsGenerated: {
    type: Number,
    default: 0,
  },

  // Error tracking
  errors: [{
    file: String,
    error: String,
    timestamp: Date,
  }],
  errorCount: {
    type: Number,
    default: 0,
  },

  // Performance metrics
  startTime: Date,
  endTime: Date,
  duration: Number, // in milliseconds
  averageChunkSize: Number,
  averageEmbeddingTime: Number, // in milliseconds

  // Configuration used
  config: {
    chunkSize: Number,
    chunkOverlap: Number,
    embeddingModel: String,
    llmProvider: String,
  },

  // Results
  results: {
    projectsScanned: Number,
    documentsIndexed: Number,
    vectorsStored: Number,
    successRate: Number, // percentage
  },

  // Metadata
  initiatedBy: String,
  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Pre-save middleware
aiTrainingSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate duration if both start and end times exist
  if (this.startTime && this.endTime) {
    this.duration = this.endTime - this.startTime;
  }
  
  // Calculate success rate
  if (this.filesProcessed > 0) {
    this.results.successRate = ((this.filesProcessed - this.errorCount) / this.filesProcessed) * 100;
  }
  
  next();
});

module.exports = mongoose.model('AITrainingSession', aiTrainingSessionSchema);
