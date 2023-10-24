const express = require('express');
const bodyParser = require('body-parser');//
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


const url = process.env.MONGODB_URI; 

// Connexion à la base de données MongoDB
 // Utilisation du nouvel analyseur d'URL
  // Utilisation du Topology Engine unifié
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB :', err);
  });
// Initialisation de l'application Express
const app = express();
// Utilisation de bodyParser pour analyser les requêtes HTTP POST. 
// Il extrait toute la partie du corps des requêtes entrantes.
// Analyse les requêtes avec l'encodage x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Analyse les requêtes avec le type de contenu 'application/json'
app.use(bodyParser.json());
// Utilisation de CORS (Cross-Origin Resource Sharing) 
// pour permettre à des requêtes d'origines différentes d'accéder à l'API
app.use(cors());

// Configuration d'un middleware pour servir
//  des fichiers statiques depuis le répertoire "image"
app.use(express.static("image"));
// Configuration d'un chemin pour servir des images statiques
app.use('/images', express.static('images'));

// Configuration des en-têtes pour répondre aux problèmes de CORS
app.use((req, res, next) => {
  // Autorise tous les domaines à accéder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
     // Liste des en-têtes autorisés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Liste des méthodes HTTP autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

    // Définition des routes pour les utilisateurs
  app.use('/api/auth', userRoutes);

  // Définition des routes pour les livres
  app.use('/api/books', bookRoutes);
  


module.exports = app;