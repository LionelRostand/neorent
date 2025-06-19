
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CostStatsProps {
  totalCosts: number;
  proprietaireCosts: number;
  locataireCosts: number;
  pendingCosts: number;
}

const CostStats = ({ totalCosts, proprietaireCosts, locataireCosts, pendingCosts }: CostStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.costManagement.totalCosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCosts}€</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.costManagement.ownerCosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{proprietaireCosts}€</div>
          <p className="text-xs text-muted-foreground">
            {totalCosts > 0 ? ((proprietaireCosts / totalCosts) * 100).toFixed(1) : 0}% du total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.costManagement.tenantCosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{locataireCosts}€</div>
          <p className="text-xs text-muted-foreground">
            {totalCosts > 0 ? ((locataireCosts / totalCosts) * 100).toFixed(1) : 0}% du total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t('maintenance.costManagement.pendingCosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{pendingCosts}€</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostStats;
