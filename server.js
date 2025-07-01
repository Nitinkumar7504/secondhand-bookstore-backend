// server.js
require('dotenv').config(); // ✅ Load environment variables first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Setup — allow Vercel frontend
app.use(cors({
  origin: 'https://secondhand-bookstore-frontend.vercel.app', // frontend URL on Vercel
  credentials: true, // allow cookies to be sent
}));

// ✅ Static folder for images or files
app.use('/uploads', express.static('uploads'));

// ✅ Debug: Check DB URI (optional, remove in prod)
console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI);

// ✅ Import and use routes
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/books', bookRoutes);     // /api/books/*
app.use('/api/auth', authRoutes);      // /api/auth/login etc.
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('📚 Secondhand Book Marketplace API is running...');
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
