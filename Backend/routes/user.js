const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Route d'inscription et de connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;