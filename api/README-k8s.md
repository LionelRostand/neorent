# Configuration Kubernetes pour l'API NeoRent

## Prérequis

- Cluster Kubernetes configuré
- kubectl installé et configuré
- Docker installé
- Registry Docker (optionnel pour production)

## Structure des fichiers

```
api/
├── Dockerfile              # Image Docker optimisée pour Kubernetes
├── k8s-deployment.yaml     # Déploiement, Service et Secret
├── k8s-ingress.yaml        # Ingress pour exposition externe
├── deploy.sh               # Script de déploiement automatique
├── healthcheck.js          # Health check pour Kubernetes
└── README-k8s.md          # Ce fichier
```

## Déploiement rapide

```bash
cd api
chmod +x deploy.sh
./deploy.sh
```

## Déploiement manuel

### 1. Construction de l'image

```bash
docker build -t neorent-api:latest .
```

### 2. Déploiement sur Kubernetes

```bash
# Appliquer toutes les configurations
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-ingress.yaml
```

### 3. Vérification

```bash
# Vérifier les pods
kubectl get pods -l app=neorent-api

# Vérifier les services
kubectl get services

# Vérifier l'ingress
kubectl get ingress

# Voir les logs
kubectl logs -l app=neorent-api
```

## Configuration personnalisée

### Variables d'environnement

Modifiez le Secret dans `k8s-deployment.yaml` :

```bash
# Encoder votre URI MongoDB en base64
echo -n "votre-uri-mongodb" | base64
```

### Domaine personnalisé

Modifiez `k8s-ingress.yaml` pour votre domaine :

```yaml
rules:
- host: votre-domaine.com
```

### Ressources

Ajustez les ressources dans `k8s-deployment.yaml` selon vos besoins :

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Production

Pour la production :

1. Utilisez un registry Docker externe
2. Configurez TLS/SSL avec cert-manager
3. Ajustez les réplicas selon la charge
4. Configurez un HPA (Horizontal Pod Autoscaler)
5. Utilisez des persistent volumes si nécessaire

## Monitoring

```bash
# Surveiller les pods en temps réel
kubectl get pods -l app=neorent-api -w

# Logs en temps réel
kubectl logs -f -l app=neorent-api

# Décrire un pod pour debugging
kubectl describe pod <pod-name>
```

## Suppression

```bash
kubectl delete -f k8s-deployment.yaml
kubectl delete -f k8s-ingress.yaml
```