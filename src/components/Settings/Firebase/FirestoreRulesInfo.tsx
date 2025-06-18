
import React from 'react';
import { useTranslation } from 'react-i18next';

export const FirestoreRulesInfo: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-4 space-y-3">
      <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-green-600 text-sm">✅</span>
          <div className="text-sm">
            <p className="font-medium text-green-800 mb-1">{t('settings.firebase.newFeatures')}:</p>
            <ul className="text-green-700 space-y-1">
              <li>• <strong>{t('settings.firebase.utilityFunctions')}:</strong> {t('settings.firebase.utilityFunctionsDesc')}</li>
              <li>• <strong>{t('settings.firebase.documentManagement')}:</strong> {t('settings.firebase.documentManagementDesc')}</li>
              <li>• <strong>{t('settings.firebase.maintenance')}:</strong> {t('settings.firebase.maintenanceDesc')}</li>
              <li>• <strong>{t('settings.firebase.employeePermissions')}:</strong> {t('settings.firebase.employeePermissionsDesc')}</li>
              <li>• <strong>{t('settings.firebase.secureConfiguration')}:</strong> {t('settings.firebase.secureConfigurationDesc')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-sm">🔒</span>
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">{t('settings.firebase.enhancedSecurity')}:</p>
            <ul className="text-blue-700 space-y-1">
              <li>• <strong>{t('settings.firebase.dataValidation')}:</strong> {t('settings.firebase.dataValidationDesc')}</li>
              <li>• <strong>{t('settings.firebase.contextualAccess')}:</strong> {t('settings.firebase.contextualAccessDesc')}</li>
              <li>• <strong>{t('settings.firebase.auditTrail')}:</strong> {t('settings.firebase.auditTrailDesc')}</li>
              <li>• <strong>{t('settings.firebase.roleIsolation')}:</strong> {t('settings.firebase.roleIsolationDesc')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-red-600 text-sm">🚨</span>
          <div className="text-sm">
            <p className="font-medium text-red-800 mb-1">{t('settings.firebase.importantConfiguration')}:</p>
            <ul className="text-red-700 space-y-1">
              <li>• {t('settings.firebase.enableFirebaseAuth')}</li>
              <li>• {t('settings.firebase.createUserRolesCollection')}</li>
              <li>• {t('settings.firebase.addDocumentWithUID')}</li>
              <li>• {t('settings.firebase.testRulesInTestMode')}</li>
              <li>• {t('settings.firebase.verifyAllUsersHaveRole')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600 text-sm">⚠️</span>
          <div className="text-sm">
            <p className="font-medium text-yellow-800 mb-1">{t('settings.firebase.deploymentInstructions')}:</p>
            <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
              <li>{t('settings.firebase.copyRulesAbove')}</li>
              <li>{t('settings.firebase.goToFirebaseConsole')}</li>
              <li>{t('settings.firebase.clickRulesTab')}</li>
              <li>{t('settings.firebase.replaceContentWithNewRules')}</li>
              <li>{t('settings.firebase.clickPublishToApply')}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
