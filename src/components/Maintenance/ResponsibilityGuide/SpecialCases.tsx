
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          {t('maintenanceResponsibilities.responsibilityGuide.specialCases')}
        </CardTitle>
        <CardDescription>
          {t('maintenanceResponsibilities.responsibilityGuide.specialSituationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {specialCases.map((specialCase, index) => (
            <Card key={index} className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {specialCase.title}
                </CardTitle>
                <Badge 
                  variant={specialCase.responsibility === t('maintenanceResponsibilities.responsibilityGuide.ownerTag') ? 'default' : 'secondary'}
                  className="w-fit"
                >
                  {specialCase.responsibility}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {specialCase.description}
                </p>
                <p className="text-xs text-muted-foreground">
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
