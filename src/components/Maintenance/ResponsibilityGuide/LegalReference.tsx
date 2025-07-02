
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';

const LegalReference = () => {
  const { t } = useTranslation();

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-blue-800 flex items-center gap-2 text-base sm:text-lg">
          <Scale className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">{t('maintenanceResponsibilities.responsibilityGuide.legalReference')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <p className="text-xs sm:text-sm text-blue-700 mb-3 sm:mb-4 leading-relaxed">
          {t('maintenanceResponsibilities.responsibilityGuide.maintenanceChargesFramework')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-white p-2 sm:p-3 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              • <strong>{t('maintenanceResponsibilities.responsibilityGuide.law1989')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.rentalReports')}
            </p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              • <strong>{t('maintenanceResponsibilities.responsibilityGuide.decree1987')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.tenantRepairs')}
            </p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              • <strong>{t('maintenanceResponsibilities.responsibilityGuide.article1724')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.landlordObligations')}
            </p>
          </div>
          <div className="bg-white p-2 sm:p-3 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              • <strong>{t('maintenanceResponsibilities.responsibilityGuide.article1728')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.tenantObligations')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalReference;
