
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface ChargeSummaryProps {
  total: number;
}

const ChargeSummary = ({ total }: ChargeSummaryProps) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-blue-800">{t('rentalCharges.totalCharges')}:</span>
          <span className="text-2xl font-bold text-blue-600">
            {total.toFixed(2)}€
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeSummary;
