# API Neorent - Node.js/Express/MongoDB

## Installation

1. Naviguez vers le dossier api :
```bash
cd api
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` basé sur `.env.example` :
```bash
cp .env.example .env
```

4. Modifiez le fichier `.env` avec vos paramètres MongoDB :
```
PORT=5000
MONGO_URI=mongodb://admin:votre_mot_de_passe@mongodb.neotech-consulting.com:30017/Neorent
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## Endpoints disponibles

### Collections MongoDB
- `GET /api/collections` - Liste toutes les collections
- `GET /api/collections/:collectionName` - Récupère les documents d'une collection

### Propriétés
- `GET /api/properties` - Liste toutes les propriétés
- `GET /api/properties/:id` - Récupère une propriété par ID
- `POST /api/properties` - Crée une nouvelle propriété
- `PUT /api/properties/:id` - Met à jour une propriété
- `DELETE /api/properties/:id` - Supprime une propriété

### Santé de l'API
- `GET /api/health` - Vérifie le statut de l'API

## Déploiement

Cette API peut être déployée sur :
- Vercel
- Railway
- Heroku
- DigitalOcean
- AWS EC2

## CORS

L'API est configurée pour accepter les requêtes depuis votre application frontend Lovable.