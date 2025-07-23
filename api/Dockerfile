# Dockerfile pour l'API NeoRent - Déploiement Kubernetes
FROM node:18-alpine

# Métadonnées
LABEL maintainer="NeoTech Consulting"
LABEL description="API Node.js pour NeoRent MongoDB"

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances en mode production
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Changer le propriétaire des fichiers vers l'utilisateur nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port de l'API
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Commande de démarrage
CMD ["node", "server.js"]