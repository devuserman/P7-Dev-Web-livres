const Book = require('../models/book');
const fs = require('fs');

// Fonction pour supprimer un fichier (image)
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error('Erreur lors de la suppression du fichier:', err);
          } else {
              console.log('Fichier supprimé avec succès:', filePath);
          }
      });
  } else {
      console.warn('Fichier introuvable:', filePath);
  }
};

exports.createBook = (req, res, next) => {
  // Vérifie si l'utilisateur est connecté
  if (!req.headers.authorization) {
     // Si un fichier a été téléchargé, le supprimer
    if (req.file) {  
      deleteFile(`./images/${req.file.filename}`);
    }
  return res.status(401).json({ error: "Vous devez être connecté pour créer un livre." });
  }
  // Extraire les données du livre de la requête
  const { title, author, year, genre, } = JSON.parse(req.body.book);
  const userId = req.userId; 
  // Créer l'URL pour l'image du livre
  const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  // Initialiser un nouveau modèle de livre avec les données
  const book = new Book({
    title,
    author,
    year,
    genre,
    userId,
    imageUrl,
    ratings: [],
    averageRating: 0
  });
   // Sauvegarder le livre dans la base de données
  book.save()
    .then((newBook) => {
      res.status(201).json(newBook);
    })
    .catch((error) => {
      // Supprime l'image en cas d'erreur lors de la sauvegarde
      deleteFile(`./images/${req.file.filename}`);  
      res.status(400).json({ error: error.message });
    });
};


exports.modifyBook = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Vous devez être connecté pour modifier un livre." });
  }
   // Prépare les données du livre pour la mise à jour
  const bookData = req.file ?
    {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // Met à jour le livre dans la base de données
  Book.updateOne({ _id: req.params.id, userId:  req.body.userId}, bookData)
    .then((result) => {
      if (result.modifiedCount) {
        res.status(200).json({ message: 'Le livre a bien été modifié !' })
      } else {
        res.status(304).json({ message: "Le livre n'a pas été modifié !" })
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


exports.deleteBook = (req, res, next) => {
  // Cherche le livre dans la base de données
  Book.findById(req.params.id)
      .then((book) => {
          if (!book) {
              return res.status(404).json({ error: "Livre non trouvé." });
          }
          console.log("imageUrl:", book.imageUrl);
          // Extraire le chemin du fichier de l'URL de l'image
          const filename = book.imageUrl.split('/images/')[1];
          console.log("filename:", filename);
          // Supprimer le fichier
          deleteFile(`./images/${filename}`);

          // Supprimer le livre de la base de données
          return Book.deleteOne({ _id: req.params.id });
      })
      .then(() => res.status(200).json({ message: 'Livre supprimé!' }))
      .catch((error) => res.status(400).json({ error }));
};

// Fonction pour obtenir les détails d'un livre
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

// Fonction pour obtenir une liste de tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {res.status(200).json(books);
     })
    .catch((error) => {res.status(400).json({error: error,});
    });
};

// Fonction pour ajouter une note à un livre
exports.createRating = async function (req, res) {
  const id = req.params.id;
  const rating = req.body.rating;
  const userId = req.userId; 

  // Vérification de la validité de la note
  if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
    return res.status(400).send("Note invalide.");
  }
  // Vérification de l'ID utilisateur
  if (!userId) {
    return res.status(400).send("Identifiant utilisateur manquant.");
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send("Livre non trouvé.");
    }

     // Vérification pour s'assurer qu'un utilisateur ne note pas un livre
     // plus d'une fois
    const previousRating = book.ratings.find(r => String(r.userId) === String(userId));
    if (previousRating) {
      return res.status(400).send("Vous avez déjà noté ce livre");
    }
    
    // Ajout de la nouvelle note
    const newRating = { userId, rating: rating};
    book.ratings.push(newRating);
    // Mise à jour de la note moyenne
    book.averageRating = calculateAverageRating(book.ratings);
    
    await book.save();
    res.send(book);
  } catch (e) {
    console.error(e);
    res.status(500).send("Quelque chose s'est mal passé:" + e.message);
  }
};

// Calculer la note moyenne
function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0; 

  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  return sumOfAllGrades / ratings.length;
};

// Obtenir les 3 meilleurs livres notés
exports.getBestRatedBooks = async function(req, res) {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);


    if (!books || books.length === 0) {
      return res.status(404).send("Aucun livre trouvé avec des notes.");
    }

    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur est survenue lors de la récupération des livres les mieux notés: " + e.message);
  }
};


