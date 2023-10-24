# P7-Dev-Web-livres

Une application web pour gérer une bibliothèque en ligne. Les utilisateurs peuvent créer des comptes, ajouter, modifier et supprimer des livres.

## Prérequis:
- Node.js
- MongoDB

## Installation et Configuration

### Backend
1. Naviguez vers le dossier Backend et installez les dépendances :
    ```bash
    cd Backend
    npm install
    ```

2. Configurez les variables d'environnement dans un fichier `.env` :
    ```
    MONGODB_URI=votre_chaîne_de_connexion_mongodb
     ```

3. Démarrage du serveur :
    ```bash
    nodemon server
    ```

### Frontend

1. Naviguez vers le dossier `Frontend` et installez les dépendances :
    ```bash
    cd Frontend
    npm install
    ```

2. Lancez l'application :
    ```bash
    npm run start
    ```

L'application devrait maintenant être accessible via votre navigateur à l'adresse `http://localhost:3000` (ou le port que vous avez spécifié).

## Technologies

- Backend : Node.js, Express.js, MongoDB.
- Frontend : React.
