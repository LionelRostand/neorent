
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface PaymentInfoCardProps {
  monthlyRent: number;
  monthlyCharges: number;
  totalMonthly: number;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  monthlyRent,
  monthlyCharges,
  totalMonthly
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 text-lg md:text-xl">
          <CreditCard className="h-5 w-5" />
          {t('tenantHistory.paymentInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('tenantHistory.paymentDetails')}</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• {t('tenantHistory.monthlyRent')}: {monthlyRent}€/mois</li>
              <li>• {t('tenantHistory.monthlyCharges')}: {monthlyCharges}€/mois</li>
              <li>• {t('tenantHistory.totalMonthly')}: {totalMonthly}€/mois</li>
              <li>• {t('tenantHistory.dueDate')}: {t('tenantHistory.firstOfMonth')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('tenantHistory.acceptedPaymentMethods')}</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• {t('tenantHistory.bankTransferRecommended')}</li>
              <li>• {t('tenantHistory.check')}</li>
              <li>• {t('tenantHistory.automaticDebit')}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
