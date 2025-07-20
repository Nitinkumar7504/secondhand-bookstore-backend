const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, author, price, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is missing' });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const seller = req.user.id;

  try {
    const book = new Book({
      title,
      author,
      price,
      description,
      seller,
      image: imagePath
    });

    await book.save();
    res.status(201).json({ message: 'Book uploaded successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.seller !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: Only uploader can delete this book' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;
