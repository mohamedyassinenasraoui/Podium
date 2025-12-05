# 🚀 Guide de Démarrage Rapide

## Installation Express

### 1. Installer les dépendances
```bash
npm run install-all
```

### 2. Configurer MongoDB

**Option A : MongoDB Local**
- Assurez-vous que MongoDB est installé et démarré
- La connexion par défaut est : `mongodb://localhost:27017/team-leaderboard`

**Option B : MongoDB Atlas**
- Créez un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Copiez votre URI de connexion
- Modifiez `MONGODB_URI` dans `server/.env`

### 3. Créer le fichier .env

Créez `server/.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-leaderboard
JWT_SECRET=changez-moi-en-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Peupler la base de données
```bash
npm run seed
```

Cela créera :
- ✅ 6 équipes avec des points
- ✅ 4 défis
- ✅ 2 comptes utilisateurs :
  - **Admin** : `admin@example.com` / `admin123`
  - **User** : `user1@example.com` / `user123`

**⚠️ Problème de connexion ?** Si vous ne pouvez pas vous connecter, réinitialisez les utilisateurs :
```bash
npm run reset-users
```

### 5. Démarrer l'application
```bash
npm run dev
```

L'application sera accessible sur :
- 🌐 Frontend : http://localhost:5173
- 🔌 Backend API : http://localhost:5000

## Premiers pas

1. **Connectez-vous** avec le compte admin
2. **Explorez le leaderboard** - vous verrez les 6 équipes avec leurs points
3. **Gérez les équipes** - créez, modifiez ou supprimez des équipes
4. **Utilisez le panneau admin** - gérez les points et les défis
5. **Testez le temps réel** - ouvrez plusieurs onglets pour voir les mises à jour automatiques

## Dépannage

### MongoDB ne se connecte pas
- Vérifiez que MongoDB est démarré : `mongod` ou `sudo systemctl start mongod`
- Vérifiez l'URI dans `server/.env`

### Port déjà utilisé
- Changez le `PORT` dans `server/.env`
- Changez le port dans `client/vite.config.js`

### Erreurs de dépendances
- Supprimez `node_modules` et réinstallez : `npm run install-all`

## Fonctionnalités à tester

- ✅ Connexion/Déconnexion
- ✅ Visualisation du leaderboard
- ✅ Création/Modification/Suppression d'équipes
- ✅ Attribution de points (admin)
- ✅ Gestion des défis (admin)
- ✅ Notifications toast
- ✅ Mises à jour en temps réel (ouvrir 2 onglets)

