const mongoose = require('mongoose');

const ratingsSchema = mongoose.Schema({
  userId: String,
  grade: Number
});

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String,  required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  ratings: [ratingsSchema],
  averageRating: Number
});

module.exports = mongoose.model('Book', bookSchema);
