# FlashLinkV2

Introduction :
Ce guide fournit des instructions pour configurer l'environnement de développement, déployer l'application et comprendre la structure du code.

Prérequis :

Node.js et npm
MongoDB
Docker et Docker Compose
Configuration de l'environnement de développement :

Clonez le dépôt GitHub :

git clone https://github.com/Erwanh11/FlashLinkV2.git
cd FlashLinkV2

Configurez les variables d'environnement :

Créez un fichier .env dans le dossier backend avec les variables suivantes :

NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/taskmanager
JWT_SECRET=your_jwt_secret

Installez les dépendances :

cd backend
npm install
cd ../frontend
npm install

Démarrez les services:

cd backend
npm start
cd ../frontend
npm start

Structure du projet :

Backend :

config/db.js : Connexion aux bases de données.
controllers/ : Logique métier des utilisateurs et des tâches.
models/ : Modèles de données Mongoose.
routes/ : Définition des routes API.
middleware/ : Middleware d'authentification.
server.js : Point d'entrée de l'application.
Frontend :

src/components/ : Composants React réutilisables.
src/pages/ : Pages principales de l'application.
src/App.js : Configuration des routes de l'application.
src/index.js : Point d'entrée de l'application.