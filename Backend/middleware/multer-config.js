const express = require('express');
const router = express.Router();

// Middleware pour gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');
const optimizeImageMiddleware = require('../utils/optimizeImageMiddleware');

// Association des types MIME des images avec leurs extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage pour multer
const storage = multer.diskStorage({
   // Destination du fichier téléchargé
  destination: (req, file, callback) => {
    console.log("Nom de fichier original:", file.originalname);
    // sauvegarder les fichiers entrants dans le dossier "images"
    callback(null, 'images/');
  },
   // Renomme le fichier pour éviter les conflits de noms
   //  et inclut la date actuelle (timestamp, le nombre de millisecondes écoulées depuis le 1er janvier 1970) 
   // pour une unicité
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
}
});

// Initialisation de Multer avec la configuration de stockage définie
const upload = multer({ storage: storage });


module.exports = upload;

