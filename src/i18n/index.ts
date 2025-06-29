
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import navigation translations
import navigationEN from './locales/en/navigation.json';
import navigationFR from './locales/fr/navigation.json';

// Import quick actions translations
import quickActionsEN from './locales/en/quickActions.json';
import quickActionsFR from './locales/fr/quickActions.json';

// Import public site translations
import publicSiteEN from './locales/en/publicSite.json';
import publicSiteFR from './locales/fr/publicSite.json';

// Import properties translations
import propertiesEN from './locales/en/properties.json';
import propertiesFR from './locales/fr/properties.json';

// Import tenants translations
import tenantsEN from './locales/en/tenants.json';
import tenantsFR from './locales/fr/tenants.json';

// Import roommates translations
import roommatesEN from './locales/en/roommates.json';
import roommatesFR from './locales/fr/roommates.json';

// Import contracts translations
import contractsEN from './locales/en/contracts.json';
import contractsFR from './locales/fr/contracts.json';

// Import common translations
import commonEN from './locales/en/common.json';
import commonFR from './locales/fr/common.json';

const resources = {
  en: {
    translation: {
      ...commonEN,
      ...navigationEN,
      ...quickActionsEN,
      ...publicSiteEN,
      ...propertiesEN,
      ...tenantsEN,
      ...roommatesEN,
      ...contractsEN
    }
  },
  fr: {
    translation: {
      ...commonFR,
      ...navigationFR,
      ...quickActionsFR,
      ...publicSiteFR,
      ...propertiesFR,
      ...tenantsFR,
      ...roommatesFR,
      ...contractsFR
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
