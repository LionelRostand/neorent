
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TaxEstimationCardProps {
  totalCurrentYearAmount: number;
  paidCurrentYear: number;
  remainingCurrentYear: number;
}

const TaxEstimationCard = ({ 
  totalCurrentYearAmount, 
  paidCurrentYear, 
  remainingCurrentYear 
}: TaxEstimationCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center text-blue-800 text-base sm:text-lg">
          <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">{t('taxes.taxEstimation2025')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-0">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('taxes.approximateTotal')}</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalCurrentYearAmount.toLocaleString('fr-FR')}€</p>
          </div>
          <div className="text-center p-3 sm:p-0">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('taxes.alreadyPaid')}</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{paidCurrentYear.toLocaleString('fr-FR')}€</p>
          </div>
          <div className="text-center p-3 sm:p-0">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('taxes.remainingToPay')}</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">{remainingCurrentYear.toLocaleString('fr-FR')}€</p>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-100 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>{t('common.note')}:</strong> {t('taxes.estimationNote')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxEstimationCard;
