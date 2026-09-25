require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS - Vercel frontend
app.use(cors({
  origin: 'https://secondhand-bookstore-frontend.vercel.app',
  credentials: true,
}));

// Uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Secondhand Bookstore API is live!');
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('DB Error:', err);
  });

// Render port
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});