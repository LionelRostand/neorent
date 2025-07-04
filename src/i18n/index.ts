
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Force French language
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },

    // Remove language detection since we only support French
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  });

export default i18n;
