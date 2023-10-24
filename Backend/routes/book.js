const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const Book = require('../models/book');
const bookCtrl = require('../controllers/book');
const optimizeImageMiddleware = require('../utils/optimizeImageMiddleware');


// Route pour créer un nouveau livre 
// multer.single('image') pour gérer le téléchargement de l'image du livre
//  pour optimiser l'image
router.post('/', auth, multer.single('image'), optimizeImageMiddleware, bookCtrl.createBook);
router.put('/:id', auth, multer.single('image'), optimizeImageMiddleware, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
// Route pour récupérer tous les livres
router.get('/', bookCtrl.getAllBooks);
// Route pour récupérer les 3 meilleurs livres notés
router.get('/bestrating',  bookCtrl.getBestRatedBooks);
// Route pour récupérer un livre spécifique par son ID
router.get('/:id',  bookCtrl.getOneBook);
// Route pour créer une note pour un livre spécifique
router.post("/:id/rating", auth, bookCtrl.createRating);




module.exports = router;
