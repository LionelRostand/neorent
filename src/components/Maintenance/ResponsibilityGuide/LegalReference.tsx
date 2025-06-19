
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LegalReference = () => {
  const { t } = useTranslation();

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">
          {t('maintenanceResponsibilities.responsibilityGuide.legalReference')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-700">
          {t('maintenanceResponsibilities.responsibilityGuide.maintenanceChargesFramework')}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>
            • <strong>{t('maintenanceResponsibilities.responsibilityGuide.law1989')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.rentalReports')}
          </li>
          <li>
            • <strong>{t('maintenanceResponsibilities.responsibilityGuide.decree1987')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.tenantRepairs')}
          </li>
          <li>
            • <strong>{t('maintenanceResponsibilities.responsibilityGuide.article1724')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.landlordObligations')}
          </li>
          <li>
            • <strong>{t('maintenanceResponsibilities.responsibilityGuide.article1728')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.tenantObligations')}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default LegalReference;
