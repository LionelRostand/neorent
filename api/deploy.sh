#!/bin/bash

# Script de déploiement Kubernetes pour l'API NeoRent

echo "🚀 Déploiement de l'API NeoRent sur Kubernetes"

# Variables
IMAGE_NAME="neorent-api"
IMAGE_TAG="latest"
NAMESPACE="default"

# 1. Builder l'image Docker
echo "📦 Construction de l'image Docker..."
docker build -t $IMAGE_NAME:$IMAGE_TAG .

# 2. Tag pour le registry (modifiez selon votre registry)
# docker tag $IMAGE_NAME:$IMAGE_TAG your-registry.com/$IMAGE_NAME:$IMAGE_TAG

# 3. Push vers le registry (décommentez si vous utilisez un registry externe)
# echo "📤 Push vers le registry..."
# docker push your-registry.com/$IMAGE_NAME:$IMAGE_TAG

# 4. Appliquer les configurations Kubernetes
echo "⚙️ Application des configurations Kubernetes..."

# Créer le namespace si nécessaire
# kubectl create namespace neorent --dry-run=client -o yaml | kubectl apply -f -

# Appliquer le déploiement
kubectl apply -f k8s-deployment.yaml

# Appliquer l'ingress
kubectl apply -f k8s-ingress.yaml

# 5. Vérifier le déploiement
echo "🔍 Vérification du déploiement..."
kubectl get pods -l app=neorent-api
kubectl get services
kubectl get ingress

echo "✅ Déploiement terminé!"
echo "📡 L'API sera accessible sur: http://api.neorent.com/api/health"
echo "🔧 Pour voir les logs: kubectl logs -l app=neorent-api"