#!/bin/sh

# Démarrer l'API Node.js en arrière-plan
cd /app/api
node index.js &

# Démarrer nginx en premier plan
nginx -g "daemon off;"