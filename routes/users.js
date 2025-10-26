const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      user_type: user.user_type,
      shop_name: user.shop_name,
      gst_number: user.gst_number,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get users (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { user_type, created_by } = req.query;
    const filter = {};
    
    if (user_type) {
      filter.user_type = user_type;
    }

    // Filter B2B users by creator (B2C user)
    if (created_by) {
      filter.created_by = created_by;
    }

    const users = await User.find(filter).select('-password').sort({ shop_name: 1 });
    
    const usersResponse = users.map(user => ({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
      shop_name: user.shop_name,
      gst_number: user.gst_number,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      created_by: user.created_by,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    res.json(usersResponse);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Create new user
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { email, password, user_type, shop_name, gst_number, full_name, phone, address, created_by } = req.body;

    // Validate input
    if (!email || !user_type) {
      return res.status(400).json({ message: 'Please provide email and user type' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password if provided, otherwise generate a random one
    const userPassword = password || Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      user_type,
      shop_name,
      gst_number,
      full_name,
      phone,
      address,
      created_by: created_by || null
    });

    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      id: newUser._id,
      email: newUser.email,
      user_type: newUser.user_type,
      shop_name: newUser.shop_name,
      gst_number: newUser.gst_number,
      full_name: newUser.full_name,
      phone: newUser.phone,
      address: newUser.address,
      created_by: newUser.created_by,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
