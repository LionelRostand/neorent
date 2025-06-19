
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FirestoreRulesInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* New Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-green-700">
            <CheckCircle className="h-5 w-5" />
            {t('settings.firebase.newFeatures')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">{t('settings.firebase.utilityFunctions')}</h4>
              <p className="text-sm text-green-700">{t('settings.firebase.utilityFunctionsDesc')}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">{t('settings.firebase.documentManagement')}</h4>
              <p className="text-sm text-green-700">{t('settings.firebase.documentManagementDesc')}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">{t('settings.firebase.maintenance')}</h4>
              <p className="text-sm text-green-700">{t('settings.firebase.maintenanceDesc')}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">{t('settings.firebase.employeePermissions')}</h4>
              <p className="text-sm text-green-700">{t('settings.firebase.employeePermissionsDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
            <Info className="h-5 w-5" />
            {t('settings.firebase.enhancedSecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">{t('settings.firebase.dataValidation')}</h4>
              <p className="text-sm text-blue-700">{t('settings.firebase.dataValidationDesc')}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">{t('settings.firebase.contextualAccess')}</h4>
              <p className="text-sm text-blue-700">{t('settings.firebase.contextualAccessDesc')}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">{t('settings.firebase.auditTrail')}</h4>
              <p className="text-sm text-blue-700">{t('settings.firebase.auditTrailDesc')}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">{t('settings.firebase.roleIsolation')}</h4>
              <p className="text-sm text-blue-700">{t('settings.firebase.roleIsolationDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            {t('settings.firebase.importantConfiguration')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>{t('settings.firebase.enableFirebaseAuth')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>{t('settings.firebase.createUserRolesCollection')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>{t('settings.firebase.addDocumentWithUID')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>{t('settings.firebase.testRulesInTestMode')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>{t('settings.firebase.verifyAllUsersHaveRole')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Deployment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
            <Info className="h-5 w-5" />
            {t('settings.firebase.deploymentInstructions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-medium mt-0.5">1.</span>
              <span>{t('settings.firebase.copyRulesAbove')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-medium mt-0.5">2.</span>
              <span>{t('settings.firebase.goToFirebaseConsole')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-medium mt-0.5">3.</span>
              <span>{t('settings.firebase.clickRulesTab')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-medium mt-0.5">4.</span>
              <span>{t('settings.firebase.replaceContentWithNewRules')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-medium mt-0.5">5.</span>
              <span>{t('settings.firebase.clickPublishToApply')}</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirestoreRulesInfo;
