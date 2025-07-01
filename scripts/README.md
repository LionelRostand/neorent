
# Scripts de Validation et Correction des Traductions

## validate-translations.js

Ce script vérifie la cohérence des traductions dans tous les fichiers de langue.

### Utilisation

```bash
# Exécuter directement avec Node.js
node scripts/validate-translations.js

# Ou rendre le script exécutable
chmod +x scripts/validate-translations.js
./scripts/validate-translations.js
```

### Ce que fait le script

1. **Analyse tous les fichiers de traduction** dans `src/i18n/locales/`
2. **Extrait toutes les clés** de manière récursive
3. **Compare les clés** entre les langues (français, anglais, allemand)
4. **Identifie les problèmes** :
   - Clés manquantes dans certaines langues
   - Clés orphelines (présentes dans une seule langue)

## fix-translations.js

Ce script corrige automatiquement les erreurs de traduction en ajoutant les clés manquantes.

### Utilisation

```bash
# Exécuter directement avec Node.js
node scripts/fix-translations.js

# Ou rendre le script exécutable
chmod +x scripts/fix-translations.js
./scripts/fix-translations.js
```

### Ce que fait le script

1. **Détecte les clés manquantes** dans chaque langue
2. **Ajoute automatiquement** les clés manquantes avec des valeurs par défaut intelligentes
3. **Maintient la structure** hiérarchique des fichiers JSON
4. **Sauvegarde les fichiers** modifiés automatiquement

### Valeurs par défaut intelligentes

Le script utilise des valeurs par défaut basées sur le nom de la clé :
- `title` → "Titre"
- `subtitle` → "Sous-titre"  
- `save` → "Sauvegarder"
- `cancel` → "Annuler"
- `loading` → "Chargement..."
- etc.

### Exemple de sortie

```
🔧 Correction des traductions en cours...

📊 Statistiques avant correction:
   FR: 245 clés
   EN: 243 clés  
   DE: 244 clés
   Total unique: 246 clés

🔧 Correction de 3 clés manquantes en EN:
     + settings.title: "Titre"
     + settings.subtitle: "Sous-titre"
     + settings.save: "Sauvegarder"
   ✅ settings.json mis à jour

✅ 3 clés de traduction ont été corrigées !
💡 Vérifiez les fichiers modifiés et ajustez les traductions si nécessaire.
```

## Workflow recommandé

1. **Vérifier** les traductions : `node scripts/validate-translations.js`
2. **Corriger** automatiquement : `node scripts/fix-translations.js`
3. **Réviser** les traductions ajoutées et les améliorer manuellement
4. **Re-vérifier** : `node scripts/validate-translations.js`

## Intégration dans votre workflow

Vous pouvez exécuter ces scripts :
- Avant chaque commit
- Dans votre CI/CD
- Régulièrement pendant le développement

Les scripts retournent un code de sortie 0 en cas de succès, ce qui permet une intégration facile dans des pipelines automatisés.
