#!/bin/sh
echo "🚀 Démarrage de NeoRent..."

# Démarrer l'API Node.js en arrière-plan
echo "📡 Démarrage de l'API..."
cd /app/api
node server.js &

# Démarrer Nginx
echo "🌐 Démarrage du serveur web..."
nginx -g 'daemon off;'