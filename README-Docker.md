
# Déploiement Docker - Neo Rent Smart Suite

## Construction et démarrage

### Méthode 1 : Docker simple
```bash
# Construire l'image
docker build -t neo-rent-smart-suite .

# Démarrer le conteneur
docker run -d -p 80:80 -p 443:443 --name neo-rent-app neo-rent-smart-suite
```

### Méthode 2 : Docker Compose (recommandé)
```bash
# Démarrer l'application
docker-compose up -d

# Arrêter l'application
docker-compose down
```

## Accès à l'application

- **HTTP**: http://localhost
- **HTTPS**: https://localhost (certificat auto-signé)

## Configuration SSL en production

Pour utiliser vos propres certificats SSL en production :

1. Placez vos certificats dans un dossier `ssl/`
2. Décommentez les volumes dans `docker-compose.yml`
3. Modifiez les chemins dans `nginx.conf` si nécessaire

## Variables d'environnement

Vous pouvez personnaliser l'application avec un fichier `.env` :

```env
NODE_ENV=production
API_URL=https://votre-api.com
```

## Redirection HTTP vers HTTPS

Pour forcer la redirection HTTP vers HTTPS, décommentez la ligne dans `nginx.conf` :
```nginx
return 301 https://$server_name$request_uri;
```

## Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs nginx
docker exec neo-rent-app tail -f /var/log/nginx/access.log
```
