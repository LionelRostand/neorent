
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import navigation translations
import navigationEN from './locales/en/navigation.json';
import navigationFR from './locales/fr/navigation.json';

// Import quick actions translations
import quickActionsEN from './locales/en/quickActions.json';
import quickActionsFR from './locales/fr/quickActions.json';

// Import other translations (assuming they exist)
import commonEN from './locales/en/common.json';
import commonFR from './locales/fr/common.json';

const resources = {
  en: {
    translation: {
      ...commonEN,
      ...navigationEN,
      ...quickActionsEN
    }
  },
  fr: {
    translation: {
      ...commonFR,
      ...navigationFR,
      ...quickActionsFR
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
