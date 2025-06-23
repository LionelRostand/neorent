
import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentDetailsCardProps {
  monthlyRent: number;
  monthlyCharges: number;
  totalAmount: number;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  monthlyRent,
  monthlyCharges,
  totalAmount
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-4 border border-green-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">{t('tenantSpace.payment.monthlyRent')}</p>
          <p className="text-lg font-semibold text-gray-900">{monthlyRent}€/mois</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('tenantSpace.payment.charges')}</p>
          <p className="text-lg font-semibold text-gray-900">{monthlyCharges}€/mois</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">{t('tenantSpace.payment.totalToPay')}</p>
          <p className="text-xl font-bold text-green-600">{totalAmount}€/mois</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsCard;
