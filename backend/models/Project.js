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
  projectCategory: {
    id: { type: String },
    name: { type: String },
  },
  scopeOfWork: {
    type: [String],
  },
  scopeOfWorkDetails: [{
    scopeId: { type: String },
    title: { type: String },
    price: { type: Number, default: 0 },
  }],
  description: {
    type: String,
    trim: true,
  },
  cost: {
    type: Number,
    min: 0,
  },
  scopeCost: {
    type: Number,
    min: 0,
    default: 0,
  },
  extrasCost: {
    type: Number,
    min: 0,
    default: 0,
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
  timelineValue: {
    type: Number,
  },
  timelineUnit: {
    type: String,
    enum: ['Days', 'Weeks', 'Months'],
  },
  paymentTerms: {
    type: String,
    trim: true,
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientEmail: {
    type: String,
    trim: true,
  },
  clientMobileNumber: {
    type: String,
    required: [true, 'Client mobile number is required'],
    trim: true,
  },
  inquiryDate: {
    type: Date,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  companyLocation: {
    type: String,
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['Startup', 'Large Corporate', 'MSME', 'Retail / E-commerce', 'Manufacturing / Production'],
  },
  yourServices: {
    type: String,
    trim: true,
  },
  yearsInBusiness: {
    type: Number,
    min: 0,
  },
  hasSalesTeam: {
    type: Boolean,
  },
  hasSocialMedia: {
    type: Boolean,
  },
  socialMediaProfiles: {
    instagram: String,
    facebook: String,
    linkedin: String,
    other: String,
  },
  annualTurnover: {
    type: String,
    enum: ['<50K', '50K–10 Lakh', '10–50 Lakh', '50 Lakh+'],
  },
  currentGoogleRanking: {
    type: String,
    enum: ['Not Listed', 'Page 2+', 'Page 1'],
  },
  hasGoogleBusinessProfile: {
    type: Boolean,
  },
  hasClientDomain: {
    type: Boolean,
  },
  hasClientLogo: {
    type: Boolean,
  },
  hasClientContent: {
    type: Boolean,
  },
  features: [String],
  customFeatures: [String],
  branch: {
    type: String,
    enum: ['Kutch Infoline', 'Lakshmi Healthcare Services', 'OptiMatrix', 'OptiMatrix Cash', 'OptiMatrix Domestic', 'OptiMatrix Export'],
  },
  numberOfPages: {
    type: Number,
    min: 0,
  },
  projectEndDate: {
    type: Date,
  },
  projectDetails: {
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

