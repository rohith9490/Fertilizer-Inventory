const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products (default products + user's custom products)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    // Build query: Show default products (is_custom=false) OR custom products created by this user
    const query = {
      is_active: true,
      $or: [
        { is_custom: false }, // Default products visible to all
        { is_custom: { $ne: true } }, // Products without is_custom flag
        { created_by: null }, // Products without creator (default products)
        ...(user_id ? [{ created_by: user_id }] : []) // User's custom products
      ]
    };

    const products = await Product.find(query).sort({ company_name: 1, product_name: 1 });
    
    const productsResponse = products.map(product => ({
      _id: product._id,
      company_name: product.company_name,
      product_name: product.product_name,
      product_id: product.product_id,
      description: product.description,
      category: product.category,
      unit: product.unit,
      is_active: product.is_active,
      is_custom: product.is_custom,
      created_by: product.created_by,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    res.json(productsResponse);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { company_name, product_name, product_id, description, category, unit, is_custom, created_by } = req.body;

    // Validate input
    if (!company_name || !product_name || !product_id) {
      return res.status(400).json({ message: 'Please provide company name, product name and ID' });
    }

    // Check if product ID already exists
    const existingProduct = await Product.findOne({ product_id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this ID already exists' });
    }

    // Create new product
    const newProduct = new Product({
      company_name,
      product_name,
      product_id,
      description,
      category,
      unit,
      is_custom: is_custom || false,
      created_by
    });

    await newProduct.save();

    const productResponse = {
      _id: newProduct._id,
      company_name: newProduct.company_name,
      product_name: newProduct.product_name,
      product_id: newProduct.product_id,
      description: newProduct.description,
      category: newProduct.category,
      unit: newProduct.unit,
      is_active: newProduct.is_active,
      is_custom: newProduct.is_custom,
      created_by: newProduct.created_by,
      created_at: newProduct.created_at,
      updated_at: newProduct.updated_at
    };

    res.status(201).json(productResponse);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
