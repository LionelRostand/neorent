
import { rulesHeader, utilityFunctions, rulesFooter } from './Rules/BaseRules';
import { propertyManagementRules } from './Rules/PropertyManagementRules';
import { maintenanceRules } from './Rules/MaintenanceRules';
import { systemRules } from './Rules/SystemRules';

export const firestoreRules = `${rulesHeader}
${utilityFunctions}
${propertyManagementRules}
${maintenanceRules}
${systemRules}
${rulesFooter}`;
