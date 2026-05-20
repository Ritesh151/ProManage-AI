/**
 * AI Chat History Model
 * Stores conversation history for reference and analytics
 */

const mongoose = require('mongoose');

const aiChatHistorySchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    default: 'anonymous',
    index: true,
  },

  // Message content
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],

  // Query information
  lastQuery: String,
  lastQueryEmbedding: [Number], // Store embedding for similarity search

  // Retrieved context
  retrievedDocuments: [{
    documentId: mongoose.Schema.Types.ObjectId,
    filename: String,
    projectName: String,
    similarity: Number,
    content: String,
  }],

  // Response metadata
  lastResponse: String,
  responseTime: Number, // in milliseconds
  tokensUsed: {
    prompt: Number,
    completion: Number,
    total: Number,
  },

  // Feedback
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    helpful: Boolean,
  },

  // Metadata
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active',
    index: true,
  },
  tags: [String],

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

// Index for efficient querying
aiChatHistorySchema.index({ conversationId: 1, createdAt: -1 });
aiChatHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AIChatHistory', aiChatHistorySchema);
