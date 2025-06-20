
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign } from 'lucide-react';

const PaymentFormHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DialogHeader className="pb-3 sm:pb-4 lg:pb-6">
      <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold text-center sm:text-left pr-6 sm:pr-8">
        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
        <span className="truncate">{t('rentManagement.addPayment')}</span>
      </DialogTitle>
    </DialogHeader>
  );
};

export default PaymentFormHeader;
