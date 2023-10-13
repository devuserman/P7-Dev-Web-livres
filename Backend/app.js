const express = require('express');
const bodyParser = require('body-parser');//
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const path = require('path');

const url = 'mongodb+srv://dev_userman:<password>@cluster0.9rqts1f.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'; 

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB :', err);
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));//
app.use(bodyParser.json());//
app.use(cors());

app.use(express.static("image"));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/auth', userRoutes);
  app.use('/api/books', bookRoutes);
  


module.exports = app;