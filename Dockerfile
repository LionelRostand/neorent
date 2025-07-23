
# Build stage pour le frontend React
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Build stage pour l'API Node.js
FROM node:18-alpine as api-build
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci --only=production
COPY api/ .

# Stage de production avec Nginx + Node.js
FROM nginx:alpine

# Installer Node.js pour l'API
RUN apk add --no-cache nodejs npm

# Copier le build React vers Nginx
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copier l'API
COPY --from=api-build /app/api /app/api

# Configuration Nginx mise à jour
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Script de démarrage
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Variables d'environnement
ENV MONGODB_URI="mongodb://admin:admin@mongodb.neotech-consulting.com:27017/neorent?authSource=admin&ssl=true&tlsAllowInvalidCertificates=true"
ENV PORT=5000

EXPOSE 80 5000

CMD ["/start.sh"]
