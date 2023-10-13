const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'inscription.' });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
        console.log(user);
          if (!user) {
              return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                console.log(valid);
                  if (!valid) {
                      return res.status(401).json({ error: 'Mot de passe incorrect !' });
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                          { userId: user._id },
                          process.env.JWT_SECRET,
                          { expiresIn: '24h' }
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};


