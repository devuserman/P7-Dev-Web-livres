// Importation du module jwt, utilisé 
// pour créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Vérification de la présence de l'en-tête d'autorisation dans la requête
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "En-tête d'autorisation manquant!" });
}
    // Extraction du token depuis l'en-tête d'autorisation
    // le format attendu est "Bearer <token>"
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    // Si aucun token n'est présent, renvoie une erreur
    if (!token) {
      return res.status(401).json({ error: "Token d'authentification manquant." });
    }
     // Récupération de la clé secrète depuis 
     // les variables d'environnement pour vérifier le token
    const JWT_SECRET = process.env.JWT_SECRET;

    // Vérification du token avec la clé secrète
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Stockage de l'ID utilisateur depuis le token décodé dans la requête 
    // pour qu'il puisse être utilisé par les middlewares/routeurs suivants
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
     // Si une erreur se produit
     //  renvoie une erreur d'authentification
    console.error('Erreur d\'authentification :', error.message);
    res.status(401).json({ error: error.message });
  }
};



