
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  totalInterventions: number;
  totalCost: number;
  proprietaireCost: number;
  locataireCost: number;
}

const StatsCards = ({
  totalInterventions,
  totalCost,
  proprietaireCost,
  locataireCost
}: StatsCardsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.maintenanceHistory.totalInterventions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInterventions}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.maintenanceHistory.totalCost')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCost}€</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.maintenanceHistory.ownerCosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{proprietaireCost}€</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.maintenanceHistory.tenantCosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{locataireCost}€</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
