/**
 * AI Document Model
 * Stores metadata about documents in the knowledge base
 */

const mongoose = require('mongoose');

const aiDocumentSchema = new mongoose.Schema({
  // Document identification
  filename: {
    type: String,
    required: true,
    index: true,
  },
  filepath: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  projectName: {
    type: String,
    required: true,
    index: true,
  },
  projectPath: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    enum: ['nodejs', 'react', 'python', 'java', 'other'],
    default: 'other',
  },

  // File metadata
  language: {
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'kotlin', 'dart', 'markdown', 'json', 'yaml', 'other'],
    default: 'other',
  },
  fileType: {
    type: String,
    enum: ['code', 'documentation', 'config', 'data', 'other'],
    default: 'other',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  fileHash: {
    type: String,
    required: true,
    index: true,
  },

  // Content metadata
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  keywords: [String],

  // Chunking information
  chunks: [{
    chunkId: String,
    chunkIndex: Number,
    content: String,
    embeddingId: String,
  }],
  totalChunks: {
    type: Number,
    default: 0,
  },

  // Processing status
  processed: {
    type: Boolean,
    default: false,
    index: true,
  },
  embeddingsGenerated: {
    type: Boolean,
    default: false,
  },
  processingError: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  lastProcessedAt: Date,
  lastModifiedAt: Date,

  // Metadata
  tags: [String],
  relatedDocuments: [mongoose.Schema.Types.ObjectId],
}, {
  timestamps: true,
  indexes: [
    { projectName: 1, filename: 1 },
    { processed: 1, embeddingsGenerated: 1 },
    { createdAt: -1 },
  ],
});

// Index for text search
aiDocumentSchema.index({ filename: 'text', content: 'text', summary: 'text' });

// Pre-save middleware
aiDocumentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AIDocument', aiDocumentSchema);
