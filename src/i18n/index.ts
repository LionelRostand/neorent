
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import French translations
import frNavigation from './locales/fr/navigation.json';
import frDashboard from './locales/fr/dashboard.json';
import frProperties from './locales/fr/properties.json';
import frCommon from './locales/fr/common.json';

// Import English translations
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enProperties from './locales/en/properties.json';
import enCommon from './locales/en/common.json';

const resources = {
  fr: {
    translation: {
      ...frNavigation,
      ...frDashboard,
      ...frProperties,
      ...frCommon
    }
  },
  en: {
    translation: {
      ...enNavigation,
      ...enDashboard,
      ...enProperties,
      ...enCommon
    }
  }
};

// Récupérer la langue sauvegardée ou utiliser français par défaut
const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // utiliser la langue sauvegardée
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
