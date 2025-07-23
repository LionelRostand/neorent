
# Étape 1: Build de l'application frontend avec Node.js
FROM node:18.20.7-alpine AS frontend-builder

# Activer Corepack pour utiliser Yarn directement
RUN corepack enable

# Définir le répertoire de travail
WORKDIR /neorent

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances frontend
COPY package*.json ./

# Configurer Yarn pour qu'il soit plus tolérant aux problèmes de réseau
RUN yarn config set network-timeout 300000 && \
    yarn config set httpRetry 5 && \
    yarn config set httpsRetry 5

# Installer les dépendances avec des retry en cas d'échec
RUN yarn install --frozen-lockfile --network-timeout 300000 || \
    yarn install --frozen-lockfile --network-timeout 300000 || \
    yarn install --frozen-lockfile --network-timeout 300000

# Copier le reste du projet frontend
COPY . .

# Construire l'application
RUN yarn build

# Étape 2: Build de l'API Node.js
FROM node:18.20.7-alpine AS api-builder

WORKDIR /neorent-api

# Copier les fichiers de l'API
COPY api/package*.json ./
RUN npm install --only=production

# Copier le code de l'API
COPY api/ ./

# Étape 3: Image finale avec nginx et Node.js
FROM node:18.20.7-alpine

# Installer nginx
RUN apk add --no-cache nginx openssl

# Copier les fichiers buildés du frontend vers nginx
COPY --from=frontend-builder /neorent/dist /usr/share/nginx/html

# Copier l'API Node.js
COPY --from=api-builder /neorent-api /app/api
WORKDIR /app/api

# Copier la configuration nginx personnalisée
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Copier le script de démarrage
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Créer le répertoire pour les certificats SSL
RUN mkdir -p /etc/nginx/ssl

# Générer un certificat auto-signé pour le développement
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=FR/ST=France/L=Paris/O=Neotech-consulting/CN=localhost"

# Exposer les ports HTTP et HTTPS
EXPOSE 80 443 5000

# Démarrer l'application avec le script
CMD ["/start.sh"]
