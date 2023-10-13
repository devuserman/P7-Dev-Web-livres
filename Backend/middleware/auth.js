const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("Erreur : En-tête d'autorisation manquant!");
      return res.status(401).json({ error: "En-tête d'autorisation manquant!" });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
      console.log("Token reçu : null");
      return next(); 
    }

    const JWT_SECRET = process.env.JWT_SECRET;
const decodedToken = jwt.verify(token, JWT_SECRET);

console.log(decodedToken);
    req.userData = decodedToken;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification :', error.message);
    res.status(401).json({ error: error.message });
  }
};


