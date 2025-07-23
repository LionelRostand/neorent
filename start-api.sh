#!/bin/bash
echo "Démarrage de l'API NeoRent..."
cd api
echo "Installation des dépendances..."
npm install
echo "Démarrage du serveur..."
npm run dev