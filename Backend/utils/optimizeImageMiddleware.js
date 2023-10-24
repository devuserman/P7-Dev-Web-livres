 // Bibliothèque pour traiter les images
const sharp = require('sharp');
// Module Node.js pour travailler avec le système de fichiers
const fs = require('fs');

const optimizeImageMiddleware = (req, res, next) => {
     // Vérifie si une image a été téléchargée avec la requête
    if (!req.file) {
        console.log('Aucun fichier fourni.');
        return next(); 
    }
       // Obtention du chemin de l'image originale
    const originalPath = req.file.path;
    console.log("Chemin original:", originalPath);
    // Définition du chemin de l'image optimisée en modifiant le nom de l'image originale
    const outputPath = originalPath.replace(/(.*)(\.\w+)$/, '$1-optimized$2');
    console.log("Chemin prévu après optimisation:", outputPath);

    // Utilisation de la bibliothèque 'sharp' pour optimiser l'image
    sharp(originalPath)
    //Redimensionnez l'image à une largeur fixe de 206 px et une hauteur fixe de 260 px
        .resize(206, 260)  
        // Compresser l'image en WEBP avec une qualité de 80 %
        .jpeg({ quality: 80 })  
        .toFile(outputPath, (err, info) => {   // Enregistre l'image optimisée
            if (err) {
                 // Gestion des erreurs pendant l'optimisation de l'image
                console.error('Erreur lors de l\'optimisation de l\'image', err);
                
                // Supprime l'image originale en cas d'erreur
                fs.unlink(originalPath, errDelete => { 
                    if (errDelete) {
                        console.error('Erreur lors de la suppression de l\'image originale', errDelete);
                    }
                });
                return res.status(500).json({ error: 'Erreur lors de l\'optimisation de l\'image' });
            }
            // Supprime l'image originale après l'optimisation réussie
            fs.unlink(originalPath, errDelete => {  // Supprimez l'image originale après l'optimisation
                if (errDelete) {
                    console.error('Erreur lors de la suppression de l\'image originale', errDelete);
                }
            });
            
              // Met à jour le chemin du fichier 
              // dans l'objet 'req' pour pointer vers l'image optimisée
            req.file.path = outputPath;  
            console.log("Chemin final après optimisation:", req.file.path);

            next();
        });
};

module.exports = optimizeImageMiddleware;

