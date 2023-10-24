const mongoose = require('mongoose');

// Définition du schéma pour les notations/ratings
const ratingsSchema = mongoose.Schema({
  userId: String,
  rating: Number
});

// Définition du schéma pour un livre
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
