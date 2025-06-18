
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PaymentFormHeader = () => {
  const { t } = useTranslation();

  return (
    <DialogHeader className="pb-6">
      <DialogTitle className="flex items-center gap-3 text-xl">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        {t('rentManagement.addPayment')}
      </DialogTitle>
    </DialogHeader>
  );
};

export default PaymentFormHeader;
