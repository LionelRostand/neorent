
import React from 'react';
import { DollarSign } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PaymentFormHeader = () => {
  return (
    <DialogHeader className="pb-6">
      <DialogTitle className="flex items-center gap-3 text-xl">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        Nouveau Règlement de Loyer
      </DialogTitle>
    </DialogHeader>
  );
};

export default PaymentFormHeader;
