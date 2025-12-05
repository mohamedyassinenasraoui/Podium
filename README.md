# 🏆 Application de Gestion d'Équipes avec Leaderboard en Temps Réel

Application full-stack pour la gestion d'équipes avec un système de points et un leaderboard mis à jour en temps réel via Socket.IO.

## ✨ Fonctionnalités

- **Gestion des équipes** : Création, édition, suppression d'équipes
- **Attribution de points** : Mise à jour des points des équipes
- **Leaderboard en temps réel** : Mise à jour automatique via Socket.IO lorsque la base de données change
- **Interface d'administration** : Gestion des défis, points et statut des équipes
- **Notifications en temps réel** : Toasts pour les changements importants
- **Accessibilité (WCAG)** : Navigation clavier, contrastes, labels ARIA, focus visibles, compatible lecteur d'écran
- **Authentification JWT** : Système d'authentification avec rôles (admin/user)

## 🛠️ Stack Technique

### Frontend
- React 18 (Vite)
- Tailwind CSS
- Socket.IO Client
- Axios

### Backend
- Node.js + Express
- Socket.IO Server
- Mongoose (MongoDB)
- JWT (jsonwebtoken)
- bcryptjs

### Base de données
- MongoDB (local ou Atlas)

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou compte Atlas)

### Étapes d'installation

1. **Cloner le projet et installer les dépendances**
```bash
npm run install-all
```

2. **Configurer les variables d'environnement**

Créez un fichier `server/.env` basé sur `server/.env.example` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-leaderboard
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

3. **Démarrer MongoDB**

Si vous utilisez MongoDB local :
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# ou
mongod --dbpath ./data
```

4. **Peupler la base de données (optionnel)**
```bash
npm run seed
```

Cela créera :
- 6 équipes avec des points
- 4 défis
- 2 utilisateurs de test :
  - Admin: `admin@example.com` / `admin123`
  - User: `user1@example.com` / `user123`

**Note :** Si vous avez des problèmes de connexion, réinitialisez les utilisateurs :
```bash
npm run reset-users
```

5. **Démarrer l'application**

En mode développement (frontend + backend) :
```bash
npm run dev
```

Ou séparément :
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## 📚 Structure du Projet

```
fullstackk/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── contexts/       # Contextes (Auth, Toast)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js
│   ├── models/            # Modèles Mongoose
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware (auth)
│   ├── scripts/           # Scripts (seed)
│   ├── index.js           # Point d'entrée
│   └── package.json
└── package.json           # Root package.json
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Les routes protégées nécessitent un token dans le header :
```
Authorization: Bearer <token>
```

### Rôles
- **Admin** : Accès complet (CRUD équipes, défis, gestion des points)
- **User** : Accès en lecture seule au leaderboard

## 🎯 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token

### Équipes
- `GET /api/teams` - Liste des équipes
- `GET /api/teams/:id` - Détails d'une équipe
- `POST /api/teams` - Créer une équipe (admin)
- `PUT /api/teams/:id` - Modifier une équipe (admin)
- `PATCH /api/teams/:id/points` - Modifier les points (admin)
- `DELETE /api/teams/:id` - Supprimer une équipe (admin)

### Défis
- `GET /api/challenges` - Liste des défis
- `GET /api/challenges/:id` - Détails d'un défi
- `POST /api/challenges` - Créer un défi (admin)
- `PUT /api/challenges/:id` - Modifier un défi (admin)
- `DELETE /api/challenges/:id` - Supprimer un défi (admin)

## 🔄 Socket.IO Events

### Émis par le serveur
- `teams:updated` - Équipes mises à jour
- `leaderboard:updated` - Leaderboard mis à jour
- `challenges:updated` - Défis mis à jour

## ♿ Accessibilité (WCAG)

L'application respecte les standards WCAG 2.1 :
- ✅ Navigation au clavier complète
- ✅ Contrastes de couleurs suffisants
- ✅ Labels ARIA sur les éléments interactifs
- ✅ Focus visible sur tous les éléments
- ✅ Compatible avec les lecteurs d'écran
- ✅ Structure sémantique HTML
- ✅ Attributs `aria-label`, `aria-required`, `role`

## 🧪 Tests

Pour tester l'application :
1. Utilisez le script de seed pour créer des données de test
2. Connectez-vous avec un compte admin
3. Testez les fonctionnalités CRUD
4. Vérifiez les mises à jour en temps réel en ouvrant plusieurs onglets

## 🚀 Déploiement

### Backend
1. Configurez les variables d'environnement en production
2. Utilisez un MongoDB Atlas ou un serveur MongoDB dédié
3. Déployez sur Heroku, Railway, ou similaire

### Frontend
1. Build : `cd client && npm run build`
2. Déployez le dossier `dist/` sur Vercel, Netlify, ou similaire
3. Configurez les variables d'environnement pour l'URL de l'API

## 📝 Notes

- Le secret JWT doit être changé en production
- MongoDB doit être accessible depuis le serveur
- Les notifications toast disparaissent après 5 secondes
- Les mises à jour en temps réel fonctionnent via Socket.IO

## 📄 Licence

ISC

