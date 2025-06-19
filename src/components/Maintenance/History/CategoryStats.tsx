
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Euro } from 'lucide-react';

interface CategoryStatsProps {
  categoryStats: Record<string, number>;
  propertyStats: Record<string, number>;
}

const CategoryStats = ({ categoryStats, propertyStats }: CategoryStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenance.maintenanceHistory.categoryStats')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium">{category}</span>
                <Badge variant="secondary">{count} {count > 1 ? t('maintenance.interventions').toLowerCase() : t('maintenance.intervention')}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenance.maintenanceHistory.propertyStats')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(propertyStats).map(([property, cost]) => (
              <div key={property} className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{property}</span>
                <div className="flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  <span className="font-semibold">{cost}€</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryStats;
