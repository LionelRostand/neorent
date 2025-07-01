
# Scripts de Validation et Traduction Automatique

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

## auto-translate.js ⭐ NOUVEAU

Ce script traduit automatiquement l'application dans les trois langues avec des traductions intelligentes et contextuelles.

### Utilisation

```bash
# Exécuter directement avec Node.js
node scripts/auto-translate.js

# Ou rendre le script exécutable
chmod +x scripts/auto-translate.js
./scripts/auto-translate.js
```

### Ce que fait le script

1. **Scan complet** de tous les fichiers de traduction
2. **Traductions intelligentes** basées sur :
   - Un dictionnaire de plus de 80 termes courants
   - Le contexte (section publicSite, dashboard, etc.)
   - La sémantique des clés
3. **Support multi-langues** :
   - 🇫🇷 Français (fr)
   - 🇬🇧 Anglais (en) 
   - 🇩🇪 Allemand (de)
4. **Traductions contextuelles** pour l'immobilier :
   - Propriétés, locataires, colocataires
   - Contrats, loyers, charges
   - Maintenance, factures, paiements

### Dictionnaire intelligent

Le script contient un dictionnaire de traductions pour :

#### Actions communes
- save/cancel/delete/edit/add/remove
- create/update/search/filter/sort
- send/download/upload

#### Interface utilisateur
- dashboard/profile/settings/help
- login/logout/register
- messages/notifications

#### Immobilier spécifique
- property/tenant/roommate/owner
- rent/charges/contract/maintenance
- invoice/payment

#### États et statuts
- active/inactive/pending/completed
- paid/unpaid/loading/error/success

### Exemple de sortie

```
🚀 Traduction automatique en cours...

📊 Statistiques avant traduction:
   FR: 245 clés
   EN: 240 clés  
   DE: 238 clés
   Total unique: 250 clés

🔄 Traduction de 10 clés manquantes en EN:
     + publicSite.hero.title: "Manage your properties with ease"
     + dashboard.stats.revenue: "Monthly Revenue"
     + maintenance.request: "Maintenance Request"
   ✅ publicSite.json mis à jour
   ✅ dashboard.json mis à jour

✅ 25 traductions ont été générées !
💡 Vérifiez les fichiers modifiés et ajustez les traductions si nécessaire.
🔍 Utilisez le script validate-translations.js pour vérifier la cohérence.
```

## Workflow recommandé

1. **Traduire automatiquement** : `node scripts/auto-translate.js`
2. **Vérifier** les traductions : `node scripts/validate-translations.js`
3. **Corriger** si nécessaire : `node scripts/fix-translations.js`
4. **Réviser** manuellement les traductions importantes
5. **Re-vérifier** : `node scripts/validate-translations.js`

## Intégration dans votre workflow

Vous pouvez exécuter ces scripts :
- Avant chaque commit
- Dans votre CI/CD
- Régulièrement pendant le développement
- Après l'ajout de nouvelles fonctionnalités

Les scripts retournent un code de sortie 0 en cas de succès, ce qui permet une intégration facile dans des pipelines automatisés.

## Scripts disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `validate-translations.js` | Vérifie la cohérence | Diagnostic |
| `fix-translations.js` | Corrige les erreurs | Correction basique |
| `auto-translate.js` | Traduction intelligente | Traduction complète |

## Conseils d'utilisation

- **Commencez par** `auto-translate.js` pour une traduction complète
- **Utilisez** `validate-translations.js` pour vérifier régulièrement
- **Réservez** `fix-translations.js` pour des corrections ponctuelles
- **Révisez toujours** les traductions automatiques importantes
- **Personnalisez** le dictionnaire dans `auto-translate.js` selon vos besoins
