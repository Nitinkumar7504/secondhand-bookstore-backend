require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// =========================
// Middleware
// =========================

app.use(express.json());
app.use(cookieParser());

// =========================
// CORS
// =========================

const allowedOrigins = [
  'https://secondhand-bookstore-frontend.onrender.com',
  'https://secondhand-bookstore-frontend.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

// =========================
// Static uploads
// =========================

app.use('/uploads', express.static('uploads'));

// =========================
// Routes
// =========================

const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// =========================
// Test / Home Route
// =========================

app.get('/', (req, res) => {
  res.send('Secondhand Bookstore API is live!');
});

// =========================
// MongoDB Connection
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('DB Error:', err);
  });

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});