
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Dictionnaire de traductions intelligentes basé sur les clés communes
const translationDictionary = {
  // Navigation et interface
  'title': { en: 'Title', fr: 'Titre', de: 'Titel' },
  'subtitle': { en: 'Subtitle', fr: 'Sous-titre', de: 'Untertitel' },
  'description': { en: 'Description', fr: 'Description', de: 'Beschreibung' },
  'name': { en: 'Name', fr: 'Nom', de: 'Name' },
  'firstName': { en: 'First Name', fr: 'Prénom', de: 'Vorname' },
  'lastName': { en: 'Last Name', fr: 'Nom', de: 'Nachname' },
  'email': { en: 'Email', fr: 'Email', de: 'E-Mail' },
  'phone': { en: 'Phone', fr: 'Téléphone', de: 'Telefon' },
  'address': { en: 'Address', fr: 'Adresse', de: 'Adresse' },
  'password': { en: 'Password', fr: 'Mot de passe', de: 'Passwort' },
  
  // Actions communes
  'save': { en: 'Save', fr: 'Sauvegarder', de: 'Speichern' },
  'cancel': { en: 'Cancel', fr: 'Annuler', de: 'Abbrechen' },
  'delete': { en: 'Delete', fr: 'Supprimer', de: 'Löschen' },
  'edit': { en: 'Edit', fr: 'Modifier', de: 'Bearbeiten' },
  'add': { en: 'Add', fr: 'Ajouter', de: 'Hinzufügen' },
  'remove': { en: 'Remove', fr: 'Retirer', de: 'Entfernen' },
  'view': { en: 'View', fr: 'Voir', de: 'Anzeigen' },
  'close': { en: 'Close', fr: 'Fermer', de: 'Schließen' },
  'open': { en: 'Open', fr: 'Ouvrir', de: 'Öffnen' },
  'create': { en: 'Create', fr: 'Créer', de: 'Erstellen' },
  'update': { en: 'Update', fr: 'Mettre à jour', de: 'Aktualisieren' },
  'search': { en: 'Search', fr: 'Rechercher', de: 'Suchen' },
  'filter': { en: 'Filter', fr: 'Filtrer', de: 'Filtern' },
  'sort': { en: 'Sort', fr: 'Trier', de: 'Sortieren' },
  'send': { en: 'Send', fr: 'Envoyer', de: 'Senden' },
  'download': { en: 'Download', fr: 'Télécharger', de: 'Herunterladen' },
  'upload': { en: 'Upload', fr: 'Téléverser', de: 'Hochladen' },
  
  // États et statuts
  'loading': { en: 'Loading...', fr: 'Chargement...', de: 'Laden...' },
  'error': { en: 'Error', fr: 'Erreur', de: 'Fehler' },
  'success': { en: 'Success', fr: 'Succès', de: 'Erfolg' },
  'warning': { en: 'Warning', fr: 'Attention', de: 'Warnung' },
  'info': { en: 'Information', fr: 'Information', de: 'Information' },
  'confirm': { en: 'Confirm', fr: 'Confirmer', de: 'Bestätigen' },
  'yes': { en: 'Yes', fr: 'Oui', de: 'Ja' },
  'no': { en: 'No', fr: 'Non', de: 'Nein' },
  'active': { en: 'Active', fr: 'Actif', de: 'Aktiv' },
  'inactive': { en: 'Inactive', fr: 'Inactif', de: 'Inaktiv' },
  'pending': { en: 'Pending', fr: 'En attente', de: 'Ausstehend' },
  'completed': { en: 'Completed', fr: 'Terminé', de: 'Abgeschlossen' },
  'paid': { en: 'Paid', fr: 'Payé', de: 'Bezahlt' },
  'unpaid': { en: 'Unpaid', fr: 'Impayé', de: 'Unbezahlt' },
  
  // Immobilier spécifique
  'property': { en: 'Property', fr: 'Propriété', de: 'Immobilie' },
  'properties': { en: 'Properties', fr: 'Propriétés', de: 'Immobilien' },
  'tenant': { en: 'Tenant', fr: 'Locataire', de: 'Mieter' },
  'tenants': { en: 'Tenants', fr: 'Locataires', de: 'Mieter' },
  'roommate': { en: 'Roommate', fr: 'Colocataire', de: 'Mitbewohner' },
  'roommates': { en: 'Roommates', fr: 'Colocataires', de: 'Mitbewohner' },
  'owner': { en: 'Owner', fr: 'Propriétaire', de: 'Eigentümer' },
  'rent': { en: 'Rent', fr: 'Loyer', de: 'Miete' },
  'charges': { en: 'Charges', fr: 'Charges', de: 'Nebenkosten' },
  'contract': { en: 'Contract', fr: 'Contrat', de: 'Vertrag' },
  'contracts': { en: 'Contracts', fr: 'Contrats', de: 'Verträge' },
  'maintenance': { en: 'Maintenance', fr: 'Maintenance', de: 'Wartung' },
  'invoice': { en: 'Invoice', fr: 'Facture', de: 'Rechnung' },
  'invoices': { en: 'Invoices', fr: 'Factures', de: 'Rechnungen' },
  'payment': { en: 'Payment', fr: 'Paiement', de: 'Zahlung' },
  'payments': { en: 'Payments', fr: 'Paiements', de: 'Zahlungen' },
  
  // Dates et temps
  'date': { en: 'Date', fr: 'Date', de: 'Datum' },
  'time': { en: 'Time', fr: 'Heure', de: 'Zeit' },
  'today': { en: 'Today', fr: 'Aujourd\'hui', de: 'Heute' },
  'yesterday': { en: 'Yesterday', fr: 'Hier', de: 'Gestern' },
  'tomorrow': { en: 'Tomorrow', fr: 'Demain', de: 'Morgen' },
  'month': { en: 'Month', fr: 'Mois', de: 'Monat' },
  'year': { en: 'Year', fr: 'Année', de: 'Jahr' },
  
  // Interface utilisateur
  'dashboard': { en: 'Dashboard', fr: 'Tableau de bord', de: 'Dashboard' },
  'profile': { en: 'Profile', fr: 'Profil', de: 'Profil' },
  'settings': { en: 'Settings', fr: 'Paramètres', de: 'Einstellungen' },
  'help': { en: 'Help', fr: 'Aide', de: 'Hilfe' },
  'about': { en: 'About', fr: 'À propos', de: 'Über uns' },
  'contact': { en: 'Contact', fr: 'Contact', de: 'Kontakt' },
  'login': { en: 'Login', fr: 'Connexion', de: 'Anmeldung' },
  'logout': { en: 'Logout', fr: 'Déconnexion', de: 'Abmeldung' },
  'register': { en: 'Register', fr: 'S\'inscrire', de: 'Registrieren' },
  
  // Messages et notifications
  'message': { en: 'Message', fr: 'Message', de: 'Nachricht' },
  'messages': { en: 'Messages', fr: 'Messages', de: 'Nachrichten' },
  'notification': { en: 'Notification', fr: 'Notification', de: 'Benachrichtigung' },
  'notifications': { en: 'Notifications', fr: 'Notifications', de: 'Benachrichtigungen' },
  
  // Documents
  'document': { en: 'Document', fr: 'Document', de: 'Dokument' },
  'documents': { en: 'Documents', fr: 'Documents', de: 'Dokumente' },
  'file': { en: 'File', fr: 'Fichier', de: 'Datei' },
  'files': { en: 'Files', fr: 'Fichiers', de: 'Dateien' }
};

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

// Fonction pour obtenir une traduction intelligente
function getIntelligentTranslation(key, language) {
  const keyParts = key.split('.');
  const lastPart = keyParts[keyParts.length - 1];
  
  // Vérifier d'abord le dictionnaire
  if (translationDictionary[lastPart]) {
    return translationDictionary[lastPart][language];
  }
  
  // Traductions contextuelles basées sur les sections
  const firstPart = keyParts[0];
  const contextualTranslations = {
    'publicSite': {
      'en': {
        'hero': 'Hero Section',
        'features': 'Features',
        'benefits': 'Benefits',
        'cta': 'Call to Action',
        'footer': 'Footer'
      },
      'fr': {
        'hero': 'Section Héro',
        'features': 'Fonctionnalités',
        'benefits': 'Avantages',
        'cta': 'Appel à l\'action',
        'footer': 'Pied de page'
      },
      'de': {
        'hero': 'Heldenbereich',
        'features': 'Funktionen',
        'benefits': 'Vorteile',
        'cta': 'Handlungsaufruf',
        'footer': 'Fußzeile'
      }
    },
    'dashboard': {
      'en': {
        'overview': 'Overview',
        'stats': 'Statistics',
        'recent': 'Recent Activity'
      },
      'fr': {
        'overview': 'Aperçu',
        'stats': 'Statistiques',
        'recent': 'Activité récente'
      },
      'de': {
        'overview': 'Überblick',
        'stats': 'Statistiken',
        'recent': 'Letzte Aktivität'
      }
    }
  };
  
  if (contextualTranslations[firstPart] && contextualTranslations[firstPart][language] && contextualTranslations[firstPart][language][lastPart]) {
    return contextualTranslations[firstPart][language][lastPart];
  }
  
  // Traductions par défaut selon la langue
  const defaultTranslations = {
    'en': `[${lastPart}]`,
    'fr': `[${lastPart}]`,
    'de': `[${lastPart}]`
  };
  
  return defaultTranslations[language] || `[${lastPart}]`;
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

// Fonction principale de traduction automatique
function autoTranslate() {
  log('🚀 Traduction automatique en cours...', 'blue');
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

  log(`📊 Statistiques avant traduction:`, 'blue');
  languages.forEach(lang => {
    log(`   ${lang.toUpperCase()}: ${allKeys[lang].size} clés`, 'reset');
  });
  log(`   Total unique: ${masterKeySet.size} clés`, 'reset');
  log('', 'reset');

  let translatedCount = 0;

  // Traduire les clés manquantes
  for (const lang of languages) {
    const missingKeys = [];
    
    for (const key of masterKeySet) {
      if (!allKeys[lang].has(key)) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      log(`🔄 Traduction de ${missingKeys.length} clés manquantes en ${lang.toUpperCase()}:`, 'yellow');
      
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

      // Ajouter les traductions dans chaque fichier
      for (const [namespace, keys] of Object.entries(keysByFile)) {
        if (translationFiles[lang][namespace]) {
          const fileData = translationFiles[lang][namespace].data;
          const filePath = translationFiles[lang][namespace].path;
          
          keys.forEach(keyPath => {
            const fullKey = `${namespace}.${keyPath}`;
            const translation = getIntelligentTranslation(fullKey, lang);
            setNestedValue(fileData, keyPath, translation);
            log(`     + ${fullKey}: "${translation}"`, 'green');
            translatedCount++;
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
  if (translatedCount > 0) {
    log(`✅ ${translatedCount} traductions ont été générées !`, 'green');
    log('💡 Vérifiez les fichiers modifiés et ajustez les traductions si nécessaire.', 'blue');
    log('🔍 Utilisez le script validate-translations.js pour vérifier la cohérence.', 'cyan');
  } else {
    log('✅ Aucune traduction nécessaire - toutes les clés sont déjà traduites !', 'green');
  }

  return translatedCount > 0;
}

// Exécuter la traduction automatique
if (require.main === module) {
  const hasChanges = autoTranslate();
  process.exit(hasChanges ? 0 : 0);
}

module.exports = { autoTranslate };
