const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishYear: {
    type: Number,
  },
  cover: {
    type: String, // Base64 encoded image
    required: true,
  },
  review: {
    type: String,
    maxLength: 500,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  openLibraryId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
