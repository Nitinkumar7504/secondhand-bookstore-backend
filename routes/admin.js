// 📁 routes/admin.js
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Order = require('../models/Order');
const Book = require('../models/Book');

const auth = require('../middleware/auth'); // JWT check

// ✅ Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// 🔐 GET /api/admin/users — Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 🔐 GET /api/admin/orders — Get all orders with user & book details (admin only)
router.get('/orders', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('bookId', 'title price');

    res.json(orders); // includes address, mobile, etc. from Order schema
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
