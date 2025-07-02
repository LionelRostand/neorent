
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

const SpecialCases = () => {
  const { t } = useTranslation();

  const specialCases = [
    {
      title: t('maintenanceResponsibilities.responsibilityGuide.hiddenDefects'),
      description: t('maintenanceResponsibilities.responsibilityGuide.hiddenDefectsDescription'),
      responsibility: t('maintenanceResponsibilities.responsibilityGuide.ownerTag'),
      details: t('maintenanceResponsibilities.responsibilityGuide.ownerDefectsDetail')
    },
    {
      title: t('maintenanceResponsibilities.responsibilityGuide.tenantDegradations'),
      description: t('maintenanceResponsibilities.responsibilityGuide.tenantDegradationsDescription'),
      responsibility: t('maintenanceResponsibilities.responsibilityGuide.tenantTag'),
      details: t('maintenanceResponsibilities.responsibilityGuide.tenantDegradationsDetail')
    },
    {
      title: t('maintenanceResponsibilities.responsibilityGuide.urgencies'),
      description: t('maintenanceResponsibilities.responsibilityGuide.urgenciesDescription'),
      responsibility: t('maintenanceResponsibilities.responsibilityGuide.ownerTag'),
      details: t('maintenanceResponsibilities.responsibilityGuide.urgenciesDetail')
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
          <span className="truncate">{t('maintenanceResponsibilities.responsibilityGuide.specialCases')}</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t('maintenanceResponsibilities.responsibilityGuide.specialSituationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {specialCases.map((specialCase, index) => (
            <Card key={index} className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                <CardTitle className="text-sm font-medium leading-tight">
                  {specialCase.title}
                </CardTitle>
                <Badge 
                  variant={specialCase.responsibility === t('maintenanceResponsibilities.responsibilityGuide.ownerTag') ? 'default' : 'secondary'}
                  className="w-fit text-xs"
                >
                  {specialCase.responsibility}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-relaxed">
                  {specialCase.description}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {specialCase.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialCases;
