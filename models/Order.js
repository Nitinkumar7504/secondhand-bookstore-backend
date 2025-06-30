const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
