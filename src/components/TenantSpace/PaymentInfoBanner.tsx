
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';

interface PaymentInfoBannerProps {
  isFullPayment: boolean;
}

const PaymentInfoBanner: React.FC<PaymentInfoBannerProps> = ({
  isFullPayment
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <div className="flex items-start gap-2">
        <Download className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">{t('tenantSpace.payment.receiptInfo')} :</p>
          <p className="text-xs">
            {isFullPayment 
              ? t('tenantSpace.payment.receiptGenerated')
              : t('tenantSpace.payment.noReceiptPartial')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoBanner;
