const mongoose = require('mongoose');

const stockTransferSchema = new mongoose.Schema({
  b2b_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  b2c_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  custom_product_name: {
    type: String,
    trim: true
  },
  custom_product_id: {
    type: String,
    trim: true
  },
  custom_supplier_name: {
    type: String,
    trim: true
  },
  custom_supplier_gst: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price_per_unit: {
    type: Number,
    required: true,
    min: 0
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  transfer_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed', 'received'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  // Bill and HSN fields
  bill_number: {
    type: String,
    trim: true
  },
  hsn_code: {
    type: String,
    trim: true
  },
  // GST Category fields
  gst_percentage: {
    type: String,
    trim: true
  },
  gst_category: {
    type: String,
    trim: true
  },
  // Seeds-specific fields
  seed_level: {
    type: String,
    trim: true
  },
  lot_number: {
    type: String,
    trim: true
  },
  number_of_bags: {
    type: Number,
    min: 0
  },
  price_per_bag: {
    type: Number,
    min: 0
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
stockTransferSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('StockTransfer', stockTransferSchema);
