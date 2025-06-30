// 📁 routes/orders.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// 🔐 POST /api/orders — Place an order
router.post('/', auth, async (req, res) => {
  const { bookId, name, address, mobile } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!bookId || !name || !address || !mobile) {
    return res.status(400).json({ error: 'All fields (bookId, name, address, mobile) are required.' });
  }

  try {
    const order = new Order({
      bookId,
      userId,
      name,
      address,
      mobile
    });

    await order.save();
    res.status(201).json({ message: '✅ Order placed successfully.', order });
  } catch (err) {
    console.error('❌ Order placement failed:', err.message);
    res.status(500).json({ error: 'Server error. Order could not be placed.' });
  }
});

// 👤 GET /api/orders — Get all orders of logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('bookId');
    res.json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch orders:', err.message);
    res.status(500).json({ error: 'Server error. Could not fetch orders.' });
  }
});

module.exports = router;
