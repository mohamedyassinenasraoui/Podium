# 🔧 Guide de Dépannage

## Problème : Impossible de se connecter (user/admin)

### Solution 1 : Réinitialiser les utilisateurs

Le problème vient souvent des mots de passe non hashés dans la base de données. Pour corriger :

1. **Supprimer les utilisateurs existants et réexécuter le seed :**
```bash
cd server
npm run seed
```

Le script de seed a été corrigé pour hasher correctement les mots de passe.

### Solution 2 : Vérifier la connexion MongoDB

Assurez-vous que MongoDB est démarré :
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# ou
mongod --dbpath ./data
```

### Solution 3 : Vérifier les variables d'environnement

Assurez-vous que `server/.env` existe et contient :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-leaderboard
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Solution 4 : Vérifier les logs du serveur

Regardez les logs du serveur pour voir les erreurs :
- Erreurs de connexion MongoDB
- Erreurs de validation
- Erreurs JWT

### Solution 5 : Créer manuellement un utilisateur

Si le seed ne fonctionne pas, vous pouvez créer un utilisateur via l'API :

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## Comptes de test (après seed)

- **Admin** : `admin@example.com` / `admin123`
- **User** : `user1@example.com` / `user123`

## Autres problèmes courants

### CORS Errors
- Vérifiez que `CLIENT_URL` dans `.env` correspond à l'URL du frontend
- Par défaut : `http://localhost:5173`

### Port déjà utilisé
- Changez le `PORT` dans `server/.env`
- Ou arrêtez le processus utilisant le port 5000

### Erreurs de dépendances
```bash
# Supprimer et réinstaller
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

### MongoDB connection refused
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans `.env`
- Pour MongoDB Atlas, vérifiez l'IP whitelist



