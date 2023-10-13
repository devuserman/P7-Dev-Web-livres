const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const Book = require('../models/book');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllStuff);
router.get('/bestrating',  bookCtrl.getBestRatedBooks);
router.get('/:id',  bookCtrl.getOneBook);

router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.createRating);




module.exports = router;