const express = require('express');
const router = express.Router();
const StockTransfer = require('../models/StockTransfer');

// @route   GET /api/stock-transfers
// @desc    Get all stock transfers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const transfers = await StockTransfer.find()
      .populate('b2b_user_id', 'shop_name gst_number email')
      .populate('b2c_user_id', 'shop_name gst_number email full_name')
      .populate('product_id', 'product_name product_id')
      .sort({ transfer_date: -1 });

    res.json(transfers);
  } catch (error) {
    console.error('Get stock transfers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stock-transfers/user/:userId
// @desc    Get stock transfers by user ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const transfers = await StockTransfer.find({ b2c_user_id: req.params.userId })
      .populate('b2b_user_id', 'shop_name gst_number email')
      .populate('product_id', 'product_name product_id')
      .sort({ transfer_date: -1 });

    console.log('Fetched transfers for user:', req.params.userId);
    console.log('First transfer bill_number:', transfers[0]?.bill_number);
    console.log('First transfer hsn_code:', transfers[0]?.hsn_code);

    res.json(transfers);
  } catch (error) {
    console.error('Get user stock transfers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stock-transfers
// @desc    Create new stock transfer
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      b2b_user_id,
      b2c_user_id,
      product_id,
      custom_product_name,
      custom_product_id,
      custom_supplier_name,
      custom_supplier_gst,
      quantity,
      price_per_unit,
      total_amount,
      transfer_date,
      status,
      notes,
      bill_number,
      hsn_code,
      gst_percentage,
      gst_category,
      seed_level,
      lot_number,
      number_of_bags,
      price_per_bag
    } = req.body;

    // Validate required fields
    if (!b2c_user_id || !quantity || !price_per_unit || !total_amount) {
      return res.status(400).json({ 
        message: 'Please provide b2c_user_id, quantity, price_per_unit, and total_amount' 
      });
    }

    // Create new stock transfer
    const newTransfer = new StockTransfer({
      b2b_user_id: b2b_user_id || null,
      b2c_user_id,
      product_id: product_id || null,
      custom_product_name,
      custom_product_id,
      custom_supplier_name,
      custom_supplier_gst,
      quantity,
      price_per_unit,
      total_amount,
      transfer_date: transfer_date || new Date(),
      status: status || 'pending',
      notes,
      bill_number,
      hsn_code,
      gst_percentage,
      gst_category,
      seed_level,
      lot_number,
      number_of_bags,
      price_per_bag
    });

    await newTransfer.save();

    console.log('Saved stock transfer with bill_number:', newTransfer.bill_number);
    console.log('Saved stock transfer with hsn_code:', newTransfer.hsn_code);

    // Populate the response
    const populatedTransfer = await StockTransfer.findById(newTransfer._id)
      .populate('b2b_user_id', 'shop_name gst_number email')
      .populate('b2c_user_id', 'shop_name gst_number email full_name')
      .populate('product_id', 'product_name product_id');

    console.log('Populated transfer bill_number:', populatedTransfer.bill_number);
    console.log('Populated transfer hsn_code:', populatedTransfer.hsn_code);

    res.status(201).json(populatedTransfer);
  } catch (error) {
    console.error('Create stock transfer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/stock-transfers/:id
// @desc    Update entire stock transfer
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const {
      custom_product_name,
      custom_product_id,
      custom_supplier_name,
      custom_supplier_gst,
      quantity,
      price_per_unit,
      total_amount,
      transfer_date,
      status,
      notes,
      bill_number,
      hsn_code,
      gst_percentage,
      gst_category,
      seed_level,
      lot_number,
      number_of_bags,
      price_per_bag
    } = req.body;

    const transfer = await StockTransfer.findById(req.params.id);
    
    if (!transfer) {
      return res.status(404).json({ message: 'Stock transfer not found' });
    }

    // Update all fields
    if (custom_product_name !== undefined) transfer.custom_product_name = custom_product_name;
    if (custom_product_id !== undefined) transfer.custom_product_id = custom_product_id;
    if (custom_supplier_name !== undefined) transfer.custom_supplier_name = custom_supplier_name;
    if (custom_supplier_gst !== undefined) transfer.custom_supplier_gst = custom_supplier_gst;
    if (quantity !== undefined) transfer.quantity = quantity;
    if (price_per_unit !== undefined) transfer.price_per_unit = price_per_unit;
    if (total_amount !== undefined) transfer.total_amount = total_amount;
    if (transfer_date !== undefined) transfer.transfer_date = transfer_date;
    if (status !== undefined) transfer.status = status;
    if (notes !== undefined) transfer.notes = notes;
    if (bill_number !== undefined) transfer.bill_number = bill_number;
    if (hsn_code !== undefined) transfer.hsn_code = hsn_code;
    if (gst_percentage !== undefined) transfer.gst_percentage = gst_percentage;
    if (gst_category !== undefined) transfer.gst_category = gst_category;
    if (seed_level !== undefined) transfer.seed_level = seed_level;
    if (lot_number !== undefined) transfer.lot_number = lot_number;
    if (number_of_bags !== undefined) transfer.number_of_bags = number_of_bags;
    if (price_per_bag !== undefined) transfer.price_per_bag = price_per_bag;
    
    await transfer.save();

    const populatedTransfer = await StockTransfer.findById(transfer._id)
      .populate('b2b_user_id', 'shop_name gst_number email')
      .populate('b2c_user_id', 'shop_name gst_number email full_name')
      .populate('product_id', 'product_name product_id');

    res.json(populatedTransfer);
  } catch (error) {
    console.error('Update stock transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/stock-transfers/:id
// @desc    Update stock transfer status
// @access  Public
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const transfer = await StockTransfer.findById(req.params.id);
    
    if (!transfer) {
      return res.status(404).json({ message: 'Stock transfer not found' });
    }

    if (status) transfer.status = status;
    if (notes !== undefined) transfer.notes = notes;
    
    await transfer.save();

    const populatedTransfer = await StockTransfer.findById(transfer._id)
      .populate('b2b_user_id', 'shop_name gst_number email')
      .populate('b2c_user_id', 'shop_name gst_number email full_name')
      .populate('product_id', 'product_name product_id');

    res.json(populatedTransfer);
  } catch (error) {
    console.error('Update stock transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
