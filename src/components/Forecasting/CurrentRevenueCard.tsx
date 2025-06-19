
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PiggyBank } from 'lucide-react';

interface CurrentRevenueCardProps {
  currentMonthlyRevenue: number;
}

const CurrentRevenueCard: React.FC<CurrentRevenueCardProps> = ({ currentMonthlyRevenue }) => {
  const { t } = useTranslation();

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <PiggyBank className="h-5 w-5" />
          {t('forecasting.currentSituation')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600">{t('forecasting.actualMonthlyRevenue')}</Label>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(currentMonthlyRevenue).toLocaleString()}€
          </div>
          <p className="text-xs text-gray-500">
            {t('forecasting.basedOnPaymentsReceived')}
          </p>
        </div>

        <Separator />

        <div>
          <Label className="text-sm text-gray-600">{t('forecasting.recommendedSavingsCapacity')}</Label>
          <div className="text-lg font-semibold text-blue-600">
            {Math.round(currentMonthlyRevenue * 0.3).toLocaleString()}€/mois
          </div>
          <p className="text-xs text-gray-500">
            {t('forecasting.thirtyPercentOfRentalIncome')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentRevenueCard;
