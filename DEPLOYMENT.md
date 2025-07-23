# Guide de déploiement NeoRent

## Frontend (React)
- **Vercel** : Connectez votre repo GitHub, déploiement automatique
- **Netlify** : Import depuis GitHub, build automatique
- **GitHub Pages** : Pour les sites statiques

## API Node.js
- **Railway** : `railway deploy` 
- **Heroku** : `git push heroku main`
- **DigitalOcean App Platform** : Import depuis GitHub

## Variables d'environnement requises
```
MONGODB_URI=mongodb://admin:admin@mongodb.neotech-consulting.com:27017/neorent?authSource=admin&ssl=true&tlsAllowInvalidCertificates=true
PORT=5000
```

## Déploiement Docker (Option 3)
```bash
# Builder l'image
docker build -t neorent-app .

# Lancer le conteneur
docker run -p 3000:80 -p 5000:5000 neorent-app
```