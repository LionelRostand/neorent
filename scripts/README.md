
# Scripts de Validation des Traductions

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

### Exemple de sortie

```
🔍 Validation des traductions en cours...

📊 Statistiques:
   FR: 245 clés
   EN: 243 clés  
   DE: 244 clés
   Total unique: 246 clés

❌ Clés manquantes en EN:
   - publicSite.ownerRegistration.requestSent
   - publicSite.ownerRegistration.requestSentDescription

⚠️  Clés orphelines (présentes dans une seule langue):
   - publicSite.test.onlyInFrench (uniquement en FR)

❌ Des erreurs de traduction ont été détectées.
💡 Assurez-vous que toutes les clés existent dans tous les fichiers de langue.
```

### Intégration dans votre workflow

Vous pouvez exécuter ce script :
- Avant chaque commit
- Dans votre CI/CD
- Régulièrement pendant le développement

Le script retourne un code de sortie 0 en cas de succès et 1 en cas d'erreur, ce qui permet une intégration facile dans des pipelines automatisés.
