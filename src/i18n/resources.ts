
import frCommon from './locales/fr/common.json';
import frProfile from './locales/fr/profile.json';
import frTenantProfile from './locales/fr/tenantProfile.json';
import frSettings from './locales/fr/settings.json';
import frMessages from './locales/fr/messages.json';
import frTenantPayments from './locales/fr/tenantPayments.json';
import frTenantDocuments from './locales/fr/tenantDocuments.json';
import frRoommateSpace from './locales/fr/roommateSpace.json';
import frTenantOverview from './locales/fr/tenantOverview.json';
import frPublic from './locales/fr/public.json';
import frRentalCharges from './locales/fr/rentalCharges.json';
import frLegal from './locales/fr/legal.json';
import frMaintenanceInterventions from './locales/fr/maintenanceInterventions.json';
import frMaintenanceHistory from './locales/fr/maintenanceHistory.json';
import frTenantHistory from './locales/fr/tenantHistory.json';
import frWebsite from './locales/fr/website.json';

// Import all other French locale files that exist in the allowed files
import frCompany from './locales/fr/settings/company.json';
import frOwnerRegistrations from './locales/fr/settings/ownerRegistrations.json';
import frPermissions from './locales/fr/settings/permissions.json';
import frDatabase from './locales/fr/settings/database.json';
import frAdminAccess from './locales/fr/settings/adminAccess.json';
import frGeneral from './locales/fr/settings/general.json';
import frEmail from './locales/fr/settings/email.json';
import frPayment from './locales/fr/settings/payment.json';
import frOwners from './locales/fr/settings/owners.json';

export const resources = {
  fr: {
    translation: {
      ...frCommon,
      ...frProfile,
      ...frTenantProfile,
      ...frSettings,
      ...frMessages,
      ...frTenantPayments,
      ...frTenantDocuments,
      ...frRoommateSpace,
      ...frTenantOverview,
      ...frPublic,
      ...frRentalCharges,
      ...frLegal,
      ...frMaintenanceInterventions,
      ...frMaintenanceHistory,
      ...frTenantHistory,
      ...frWebsite,
      ...frCompany,
      ...frOwnerRegistrations,
      ...frPermissions,
      ...frDatabase,
      ...frAdminAccess,
      ...frGeneral,
      ...frEmail,
      ...frPayment,
      ...frOwners
    }
  }
};
