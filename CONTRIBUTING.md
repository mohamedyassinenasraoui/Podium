# Guide de Contribution

## Développement

### Structure du projet
- `client/` : Application React frontend
- `server/` : API Node.js backend

### Commandes disponibles

```bash
# Installer toutes les dépendances
npm run install-all

# Démarrer en mode développement (frontend + backend)
npm run dev

# Démarrer uniquement le backend
npm run server

# Démarrer uniquement le frontend
npm run client

# Peupler la base de données
npm run seed
```

## Standards de code

- Utiliser des noms de variables descriptifs
- Commenter le code complexe
- Respecter les conventions ESLint/Prettier
- Tester les fonctionnalités avant de commit

## Accessibilité

Tous les composants doivent respecter les standards WCAG 2.1 :
- Navigation clavier complète
- Labels ARIA appropriés
- Contrastes de couleurs suffisants
- Focus visible

## Tests

Avant de soumettre une PR :
1. Tester toutes les fonctionnalités
2. Vérifier l'accessibilité avec un lecteur d'écran
3. Tester sur différents navigateurs



