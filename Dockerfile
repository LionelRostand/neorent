
# Étape 1: Build de l'application avec Node.js
FROM node:18.20.7-alpine AS builder

# Activer Corepack pour utiliser Yarn directement
RUN corepack enable

# Définir le répertoire de travail
WORKDIR /neorh

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Configurer Yarn pour qu'il soit plus tolérant aux problèmes de réseau
RUN yarn config set network-timeout 300000 && \
    yarn config set httpRetry 5 && \
    yarn config set httpsRetry 5

# Installer les dépendances avec des retry en cas d'échec
RUN yarn install --frozen-lockfile --network-timeout 300000 || \
    yarn install --frozen-lockfile --network-timeout 300000 || \
    yarn install --frozen-lockfile --network-timeout 300000

# Copier le reste du projet
COPY . .

# Construire l'application
RUN yarn build

# Étape 2: Image finale avec nginx
FROM nginx:alpine

# Copier les fichiers buildés vers nginx
COPY --from=builder /neorh/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Créer le répertoire pour les certificats SSL
RUN mkdir -p /etc/nginx/ssl

# Générer un certificat auto-signé pour le développement
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=FR/ST=France/L=Paris/O=Neotech-consulting/CN=localhost"

# Exposer les ports HTTP et HTTPS
EXPOSE 80 443

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
