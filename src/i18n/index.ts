
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import French translations
import frNavigation from './locales/fr/navigation.json';
import frDashboard from './locales/fr/dashboard.json';
import frProperties from './locales/fr/properties.json';
import frCommon from './locales/fr/common.json';
import frTenants from './locales/fr/tenants.json';
import frRoommates from './locales/fr/roommates.json';
import frContracts from './locales/fr/contracts.json';
import frInspections from './locales/fr/inspections.json';
import frRentManagement from './locales/fr/rentManagement.json';
import frRentalCharges from './locales/fr/rentalCharges.json';
import frForecasting from './locales/fr/forecasting.json';
import frMaintenance from './locales/fr/maintenance.json';
import frMessages from './locales/fr/messages.json';
import frTaxes from './locales/fr/taxes.json';
import frWebsite from './locales/fr/website.json';
import frSettings from './locales/fr/settings.json';
import frHelp from './locales/fr/help.json';

// Import English translations
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enProperties from './locales/en/properties.json';
import enCommon from './locales/en/common.json';
import enTenants from './locales/en/tenants.json';
import enRoommates from './locales/en/roommates.json';
import enContracts from './locales/en/contracts.json';
import enInspections from './locales/en/inspections.json';
import enRentManagement from './locales/en/rentManagement.json';
import enRentalCharges from './locales/en/rentalCharges.json';
import enForecasting from './locales/en/forecasting.json';
import enMaintenance from './locales/en/maintenance.json';
import enMessages from './locales/en/messages.json';
import enTaxes from './locales/en/taxes.json';
import enWebsite from './locales/en/website.json';
import enSettings from './locales/en/settings.json';
import enHelp from './locales/en/help.json';

const resources = {
  fr: {
    translation: {
      ...frNavigation,
      ...frDashboard,
      ...frProperties,
      ...frCommon,
      ...frTenants,
      ...frRoommates,
      ...frContracts,
      ...frInspections,
      ...frRentManagement,
      ...frRentalCharges,
      ...frForecasting,
      ...frMaintenance,
      ...frMessages,
      ...frTaxes,
      ...frWebsite,
      ...frSettings,
      ...frHelp
    }
  },
  en: {
    translation: {
      ...enNavigation,
      ...enDashboard,
      ...enProperties,
      ...enCommon,
      ...enTenants,
      ...enRoommates,
      ...enContracts,
      ...enInspections,
      ...enRentManagement,
      ...enRentalCharges,
      ...enForecasting,
      ...enMaintenance,
      ...enMessages,
      ...enTaxes,
      ...enWebsite,
      ...enSettings,
      ...enHelp
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
