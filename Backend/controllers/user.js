const jwt = require('jsonwebtoken'); // Pour créer et vérifier les tokens JWT
const bcrypt = require('bcrypt'); // Pour le hashage des mots de passe
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
     // Hashage du mot de passe avec bcrypt (10 tours de hashage)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Création d'un nouvel utilisateur avec le modèle User
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });
    // Enregistrement de l'utilisateur dans la base de données
    await user.save();
    // Envoi des réponse ....
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'inscription.' });
  }
};
// Fonction de connexion d'un utilisateur existant
exports.login = (req, res, next) => {
   // Recherche de l'utilisateur par email dans la base de données
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          }
           // Comparaison du mot de passe fourni avec le mot de passe hashé stocké
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ error: 'Mot de passe incorrect !' });
                  }
                  // Si la comparaison réussit, génération et renvoi d'un token JWT
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                          { userId: user._id },
                          process.env.JWT_SECRET,
                          { expiresIn: '24h' }  // Durée de vie du token
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};


