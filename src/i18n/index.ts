
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enProperties from './locales/en/properties.json';
import enTenants from './locales/en/tenants.json';
import enRoommates from './locales/en/roommates.json';
import enContracts from './locales/en/contracts.json';
import enInspections from './locales/en/inspections.json';
import enRentManagement from './locales/en/rentManagement.json';
import enRentalCharges from './locales/en/rentalCharges.json';
import enForecasting from './locales/en/forecasting.json';
import enMaintenanceCommon from './locales/en/maintenanceCommon.json';
import enMaintenanceRequests from './locales/en/maintenanceRequests.json';
import enMaintenanceInterventions from './locales/en/maintenanceInterventions.json';
import enMaintenanceCosts from './locales/en/maintenanceCosts.json';
import enMaintenanceHistory from './locales/en/maintenanceHistory.json';
import enMaintenanceResponsibilities from './locales/en/maintenanceResponsibilities.json';
import enMessages from './locales/en/messages.json';
import enTaxes from './locales/en/taxes.json';
import enWebsite from './locales/en/website.json';
import enSettings from './locales/en/settings.json';
import enHelp from './locales/en/help.json';
import enPublicSite from './locales/en/publicSite.json';
import enTenantSpace from './locales/en/tenantSpace.json';
import enTenantOverview from './locales/en/tenantOverview.json';
import enTenantPayments from './locales/en/tenantPayments.json';
import enTenantHistory from './locales/en/tenantHistory.json';
import enTenantDocuments from './locales/en/tenantDocuments.json';
import enTenantUpload from './locales/en/tenantUpload.json';
import enTenantProfile from './locales/en/tenantProfile.json';
import enOwnerSpace from './locales/en/ownerSpace.json';

// French translations
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frDashboard from './locales/fr/dashboard.json';
import frProperties from './locales/fr/properties.json';
import frTenants from './locales/fr/tenants.json';
import frRoommates from './locales/fr/roommates.json';
import frContracts from './locales/fr/contracts.json';
import frInspections from './locales/fr/inspections.json';
import frRentManagement from './locales/fr/rentManagement.json';
import frRentalCharges from './locales/fr/rentalCharges.json';
import frForecasting from './locales/fr/forecasting.json';
import frMaintenanceCommon from './locales/fr/maintenanceCommon.json';
import frMaintenanceRequests from './locales/fr/maintenanceRequests.json';
import frMaintenanceInterventions from './locales/fr/maintenanceInterventions.json';
import frMaintenanceCosts from './locales/fr/maintenanceCosts.json';
import frMaintenanceHistory from './locales/fr/maintenanceHistory.json';
import frMaintenanceResponsibilities from './locales/fr/maintenanceResponsibilities.json';
import frMessages from './locales/fr/messages.json';
import frTaxes from './locales/fr/taxes.json';
import frWebsite from './locales/fr/website.json';
import frSettings from './locales/fr/settings.json';
import frHelp from './locales/fr/help.json';
import frPublicSite from './locales/fr/publicSite.json';
import frTenantSpace from './locales/fr/tenantSpace.json';
import frTenantHistory from './locales/fr/tenantHistory.json';
import frTenantUpload from './locales/fr/tenantUpload.json';
import frTenantProfile from './locales/fr/tenantProfile.json';
import frOwnerSpace from './locales/fr/ownerSpace.json';

const resources = {
  en: {
    translation: {
      ...enCommon,
      ...enNavigation,
      ...enDashboard,
      ...enProperties,
      ...enTenants,
      ...enRoommates,
      ...enContracts,
      ...enInspections,
      ...enRentManagement,
      ...enRentalCharges,
      ...enForecasting,
      ...enMaintenanceCommon,
      ...enMaintenanceRequests,
      ...enMaintenanceInterventions,
      ...enMaintenanceCosts,
      ...enMaintenanceHistory,
      ...enMaintenanceResponsibilities,
      ...enMessages,
      ...enTaxes,
      ...enWebsite,
      ...enSettings,
      ...enHelp,
      ...enPublicSite,
      ...enTenantSpace,
      ...enTenantOverview,
      ...enTenantPayments,
      ...enTenantHistory,
      ...enTenantDocuments,
      ...enTenantUpload,
      ...enTenantProfile,
      ...enOwnerSpace
    }
  },
  fr: {
    translation: {
      ...frCommon,
      ...frNavigation,
      ...frDashboard,
      ...frProperties,
      ...frTenants,
      ...frRoommates,
      ...frContracts,
      ...frInspections,
      ...frRentManagement,
      ...frRentalCharges,
      ...frForecasting,
      ...frMaintenanceCommon,
      ...frMaintenanceRequests,
      ...frMaintenanceInterventions,
      ...frMaintenanceCosts,
      ...frMaintenanceHistory,
      ...frMaintenanceResponsibilities,
      ...frMessages,
      ...frTaxes,
      ...frWebsite,
      ...frSettings,
      ...frHelp,
      ...frPublicSite,
      ...frTenantSpace,
      ...frTenantHistory,
      ...frTenantUpload,
      ...frTenantProfile,
      ...frOwnerSpace
    }
  }
};

// Set French as default language to match the interface
const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    },
    debug: false
  });

export default i18n;
