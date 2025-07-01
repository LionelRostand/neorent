
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour extraire toutes les clés d'un objet JSON de manière récursive
function extractKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...extractKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

// Fonction pour définir une valeur dans un objet imbriqué
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Fonction pour obtenir une valeur par défaut intelligente
function getDefaultValue(key, referenceLang = 'fr') {
  const keyParts = key.split('.');
  const lastPart = keyParts[keyParts.length - 1];
  
  // Valeurs par défaut basées sur le nom de la clé
  const defaultValues = {
    'title': 'Titre',
    'subtitle': 'Sous-titre',
    'description': 'Description',
    'name': 'Nom',
    'email': 'Email',
    'phone': 'Téléphone',
    'address': 'Adresse',
    'save': 'Sauvegarder',
    'cancel': 'Annuler',
    'delete': 'Supprimer',
    'edit': 'Modifier',
    'add': 'Ajouter',
    'loading': 'Chargement...',
    'error': 'Erreur',
    'success': 'Succès',
    'warning': 'Attention',
    'confirm': 'Confirmer',
    'yes': 'Oui',
    'no': 'Non'
  };
  
  return defaultValues[lastPart] || `[${lastPart}]`;
}

// Fonction pour charger un fichier JSON
function loadTranslationFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`❌ Erreur lors du chargement de ${filePath}: ${error.message}`, 'red');
    return null;
  }
}

// Fonction pour sauvegarder un fichier JSON
function saveTranslationFile(filePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');
    return true;
  } catch (error) {
    log(`❌ Erreur lors de la sauvegarde de ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

// Fonction principale de correction
function fixTranslations() {
  log('🔧 Correction des traductions en cours...', 'blue');
  log('', 'reset');

  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const languages = ['fr', 'en', 'de'];
  const translationFiles = {};
  const allKeys = {};

  // Charger tous les fichiers de traduction
  for (const lang of languages) {
    const langDir = path.join(localesDir, lang);
    translationFiles[lang] = {};
    allKeys[lang] = new Set();

    if (!fs.existsSync(langDir)) {
      log(`❌ Dossier de langue manquant: ${langDir}`, 'red');
      continue;
    }

    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(langDir, file);
      const namespace = path.basename(file, '.json');
      const content = loadTranslationFile(filePath);
      
      if (content) {
        translationFiles[lang][namespace] = {
          path: filePath,
          data: content
        };
        const keys = extractKeys(content);
        keys.forEach(key => allKeys[lang].add(`${namespace}.${key}`));
      }
    }
  }

  // Créer l'ensemble de toutes les clés uniques
  const masterKeySet = new Set();
  Object.values(allKeys).forEach(langKeys => {
    langKeys.forEach(key => masterKeySet.add(key));
  });

  log(`📊 Statistiques avant correction:`, 'blue');
  languages.forEach(lang => {
    log(`   ${lang.toUpperCase()}: ${allKeys[lang].size} clés`, 'reset');
  });
  log(`   Total unique: ${masterKeySet.size} clés`, 'reset');
  log('', 'reset');

  let fixedCount = 0;

  // Corriger les clés manquantes
  for (const lang of languages) {
    const missingKeys = [];
    
    for (const key of masterKeySet) {
      if (!allKeys[lang].has(key)) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      log(`🔧 Correction de ${missingKeys.length} clés manquantes en ${lang.toUpperCase()}:`, 'yellow');
      
      // Grouper les clés par fichier
      const keysByFile = {};
      missingKeys.forEach(key => {
        const [namespace, ...keyParts] = key.split('.');
        const keyPath = keyParts.join('.');
        
        if (!keysByFile[namespace]) {
          keysByFile[namespace] = [];
        }
        keysByFile[namespace].push(keyPath);
      });

      // Ajouter les clés manquantes dans chaque fichier
      for (const [namespace, keys] of Object.entries(keysByFile)) {
        if (translationFiles[lang][namespace]) {
          const fileData = translationFiles[lang][namespace].data;
          const filePath = translationFiles[lang][namespace].path;
          
          keys.forEach(keyPath => {
            const defaultValue = getDefaultValue(keyPath);
            setNestedValue(fileData, keyPath, defaultValue);
            log(`     + ${namespace}.${keyPath}: "${defaultValue}"`, 'green');
            fixedCount++;
          });

          // Sauvegarder le fichier modifié
          if (saveTranslationFile(filePath, fileData)) {
            log(`   ✅ ${namespace}.json mis à jour`, 'green');
          }
        } else {
          log(`   ⚠️  Fichier ${namespace}.json introuvable pour ${lang}`, 'yellow');
        }
      }
      
      log('', 'reset');
    }
  }

  // Résultat final
  if (fixedCount > 0) {
    log(`✅ ${fixedCount} clés de traduction ont été corrigées !`, 'green');
    log('💡 Vérifiez les fichiers modifiés et ajustez les traductions si nécessaire.', 'blue');
  } else {
    log('✅ Aucune correction nécessaire - toutes les traductions sont cohérentes !', 'green');
  }

  return fixedCount > 0;
}

// Exécuter la correction
if (require.main === module) {
  const hasChanges = fixTranslations();
  process.exit(hasChanges ? 0 : 0); // Toujours succès, même s'il n'y a pas de changements
}

module.exports = { fixTranslations };
