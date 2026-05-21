const mongoose = require('mongoose');

const scopeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Scope item title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const scopeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: 'FiBriefcase',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    scopeItems: [scopeItemSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ScopeCategory', scopeCategorySchema);
