const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  srNo: {
    type: Number,
  },
  projectId: {
    type: String,
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  scopeOfWork: {
    type: [String],
  },
  description: {
    type: String,
    trim: true,
  },
  cost: {
    type: Number,
    min: 0,
  },
  costBreakdown: [{
    name: { type: String },
    amount: { type: Number },
  }],
  technologies: {
    frontend: [String],
    backend: [String],
    database: [String],
    other: [String]
  },
  timeline: {
    type: String,
    trim: true,
  },
  paymentTerms: {
    type: String,
    trim: true,
  },
  clientName: {
    type: String,
    trim: true,
  },
  clientEmail: {
    type: String,
    trim: true,
  },
  signature: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Active',
  },
  proposalGenerated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
