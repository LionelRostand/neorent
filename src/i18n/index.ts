
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

// Import inspections translations
import inspectionsEN from './locales/en/inspections.json';
import inspectionsFR from './locales/fr/inspections.json';

// Import rent management translations
import rentManagementEN from './locales/en/rentManagement.json';
import rentManagementFR from './locales/fr/rentManagement.json';

// Import rental charges translations
import rentalChargesEN from './locales/en/rentalCharges.json';
import rentalChargesFR from './locales/fr/rentalCharges.json';

// Import forecasting translations
import forecastingEN from './locales/en/forecasting.json';
import forecastingFR from './locales/fr/forecasting.json';

// Import maintenance translations
import maintenanceEN from './locales/en/maintenanceCommon.json';
import maintenanceFR from './locales/fr/maintenanceCommon.json';

// Import maintenance requests translations
import maintenanceRequestsEN from './locales/en/maintenanceRequests.json';
import maintenanceRequestsFR from './locales/fr/maintenanceRequests.json';

// Import maintenance responsibilities translations
import maintenanceResponsibilitiesEN from './locales/en/maintenanceResponsibilities.json';
import maintenanceResponsibilitiesFR from './locales/fr/maintenanceResponsibilities.json';

// Import maintenance interventions translations
import maintenanceInterventionsEN from './locales/en/maintenanceInterventions.json';
import maintenanceInterventionsFR from './locales/fr/maintenanceInterventions.json';

// Import maintenance history translations
import maintenanceHistoryEN from './locales/en/maintenanceHistory.json';
import maintenanceHistoryFR from './locales/fr/maintenanceHistory.json';

// Import maintenance costs translations
import maintenanceCostsEN from './locales/en/maintenanceCosts.json';
import maintenanceCostsFR from './locales/fr/maintenanceCosts.json';

// Import messages translations
import messagesEN from './locales/en/messages.json';
import messagesFR from './locales/fr/messages.json';

// Import taxes translations
import taxesEN from './locales/en/taxes.json';
import taxesFR from './locales/fr/taxes.json';

// Import settings translations
import settingsEN from './locales/en/settings.json';
import settingsFR from './locales/fr/settings.json';

// Import specific settings translations
import settingsPermissionsFR from './locales/fr/settings/permissions.json';
import settingsOwnersFR from './locales/fr/settings/owners.json';
import settingsFirebaseFR from './locales/fr/settings/firebase.json';

// Import help translations
import helpEN from './locales/en/help.json';
import helpFR from './locales/fr/help.json';

// Import common translations
import commonEN from './locales/en/common.json';
import commonFR from './locales/fr/common.json';

// Import website translations
import websiteEN from './locales/en/website.json';
import websiteFR from './locales/fr/website.json';

// Import pages translations
import pagesEN from './locales/en/pages.json';
import pagesFR from './locales/fr/pages.json';

// Import tenant and roommate space translations
import tenantSpaceFR from './locales/fr/tenantSpace.json';
import roommateSpaceFR from './locales/fr/roommateSpace.json';

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
      ...contractsEN,
      ...inspectionsEN,
      ...rentManagementEN,
      ...rentalChargesEN,
      ...forecastingEN,
      ...maintenanceEN,
      ...maintenanceRequestsEN,
      ...maintenanceResponsibilitiesEN,
      ...maintenanceInterventionsEN,
      ...maintenanceHistoryEN,
      ...maintenanceCostsEN,
      ...messagesEN,
      ...taxesEN,
      ...settingsEN,
      ...helpEN,
      ...websiteEN,
      ...pagesEN
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
      ...contractsFR,
      ...inspectionsFR,
      ...rentManagementFR,
      ...rentalChargesFR,
      ...forecastingFR,
      ...maintenanceFR,
      ...maintenanceRequestsFR,
      ...maintenanceResponsibilitiesFR,
      ...maintenanceInterventionsFR,
      ...maintenanceHistoryFR,
      ...maintenanceCostsFR,
      ...messagesFR,
      ...taxesFR,
      ...settingsFR,
      ...settingsPermissionsFR,
      ...settingsOwnersFR,
      ...settingsFirebaseFR,
      ...helpFR,
      ...websiteFR,
      ...pagesFR,
      ...tenantSpaceFR,
      ...roommateSpaceFR
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
