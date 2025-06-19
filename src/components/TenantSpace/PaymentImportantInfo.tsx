
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

const PaymentImportantInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">{t('tenantSpace.payment.importantInfo')} :</p>
          <ul className="space-y-1 text-xs">
            <li>{t('tenantSpace.payment.paymentBefore5th')}</li>
            <li>{t('tenantSpace.payment.enterExactAmount')}</li>
            <li>{t('tenantSpace.payment.receiptFullPayment')}</li>
            <li>{t('tenantSpace.payment.alertDifferentAmount')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentImportantInfo;
