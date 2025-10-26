const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_custom: {
    type: Boolean,
    default: false
  },
  gst_category: {
    type: String,
    trim: true
  },
  gst_percentage: {
    type: String,
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at timestamp before saving
productSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
