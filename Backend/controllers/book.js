const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Vous devez être connecté pour créer un livre." });
  }

  const { title, author, year, genre } = JSON.parse(req.body.book);
  const userId = req.userData.userId; 
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  const book = new Book({
    title,
    author,
    year,
    genre,
    userId,
    imageUrl,
  });

  book.save()
    .then((newBook) => {
      res.status(201).json(newBook);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.modifyBook = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Vous devez être connecté pour modifier un livre." });
  }

  const bookData = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookData._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId.toString() !== req.userData.userId.toString()) { 
        return res.status(401).json({ message: 'Not authorized' });
      }

      return Book.updateOne({ _id: req.params.id }, bookData)
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Vous devez être connecté pour supprimer un livre." });
  }
 
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId.toString() !== req.userData.userId.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = async (req, res, next) => {
 
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue lors de la récupération du livre" });
  }
};

exports.getAllStuff = (req, res, next) => {
  
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.createRating = async function (req, res) {
  const id = req.params.id;
  const rating = req.body.rating;
  const userId = req.userId; 

  if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
    return res.status(400).send("Note invalide.");
  }

  if (!userId) {
    return res.status(400).send("Identifiant utilisateur manquant.");
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send("Livre non trouvé.");
    }

    const previousRating = book.ratings.find(r => String(r.userId) === String(userId));
    if (previousRating) {
      return res.status(400).send("Vous avez déjà noté ce livre");
    }

    const newRating = { userId, grade: rating };
    book.ratings.push(newRating);

    book.averageRating = calculateAverageRating(book.ratings);
    
    await book.save();
    res.send(book);
  } catch (e) {
    console.error(e);
    res.status(500).send("Quelque chose s'est mal passé:" + e.message);
  }
};

function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0; 

  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  return sumOfAllGrades / ratings.length;
};

exports.getBestRatedBooks = async function(req, res) {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(10);

    if (!books || books.length === 0) {
      return res.status(404).send("Aucun livre trouvé avec des notes.");
    }

    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur est survenue lors de la récupération des livres les mieux notés: " + e.message);
  }
};


