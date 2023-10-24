const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
// Configuration des variables d'environnement à l'aide du module 'dotenv'
dotenv.config(); 

// Fonction pour normaliser le port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Configuration du port d'écoute soit 
// à partir de la variable d'environnement ou du port 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      // Vérifie si l'application n'est PAS en mode production
      if (process.env.NODE_ENV !== 'production') {
        console.error("Detailed error info: ", error);
      }
      throw error;
  }
};
// Création du serveur HTTP à l'aide de l'application Express
const server = http.createServer(app);
// Écoute des événements sur le serveur
server.on('error', errorHandler); // En cas d'erreur
server.on('listening', () => {    // Lorsque le serveur commence à écouter les requêtes
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Démarrage du serveur sur le port configuré
server.listen(port);
