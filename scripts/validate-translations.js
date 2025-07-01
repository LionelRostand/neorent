
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

// Fonction principale de validation
function validateTranslations() {
  log('🔍 Validation des traductions en cours...', 'blue');
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
        translationFiles[lang][namespace] = content;
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

  log(`📊 Statistiques:`, 'blue');
  languages.forEach(lang => {
    log(`   ${lang.toUpperCase()}: ${allKeys[lang].size} clés`, 'reset');
  });
  log(`   Total unique: ${masterKeySet.size} clés`, 'reset');
  log('', 'reset');

  // Vérifier les clés manquantes
  let hasErrors = false;
  
  for (const lang of languages) {
    const missingKeys = [];
    
    for (const key of masterKeySet) {
      if (!allKeys[lang].has(key)) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      hasErrors = true;
      log(`❌ Clés manquantes en ${lang.toUpperCase()}:`, 'red');
      missingKeys.forEach(key => {
        log(`   - ${key}`, 'yellow');
      });
      log('', 'reset');
    }
  }

  // Vérifier les clés orphelines (présentes dans une seule langue)
  const orphanKeys = [];
  
  for (const key of masterKeySet) {
    const languagesWithKey = languages.filter(lang => allKeys[lang].has(key));
    
    if (languagesWithKey.length === 1) {
      orphanKeys.push({
        key,
        language: languagesWithKey[0]
      });
    }
  }

  if (orphanKeys.length > 0) {
    hasErrors = true;
    log(`⚠️  Clés orphelines (présentes dans une seule langue):`, 'yellow');
    orphanKeys.forEach(({key, language}) => {
      log(`   - ${key} (uniquement en ${language.toUpperCase()})`, 'yellow');
    });
    log('', 'reset');
  }

  // Résultat final
  if (!hasErrors) {
    log('✅ Toutes les traductions sont cohérentes !', 'green');
  } else {
    log('❌ Des erreurs de traduction ont été détectées.', 'red');
    log('💡 Assurez-vous que toutes les clés existent dans tous les fichiers de langue.', 'blue');
  }

  return !hasErrors;
}

// Exécuter la validation
if (require.main === module) {
  const success = validateTranslations();
  process.exit(success ? 0 : 1);
}

module.exports = { validateTranslations };
