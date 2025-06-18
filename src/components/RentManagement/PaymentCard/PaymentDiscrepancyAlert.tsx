
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PaymentDiscrepancyAlertProps {
  hasDiscrepancy: boolean;
}

const PaymentDiscrepancyAlert: React.FC<PaymentDiscrepancyAlertProps> = ({ hasDiscrepancy }) => {
  if (!hasDiscrepancy) {
    return null;
  }

  return (
    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-center text-xs text-red-700">
        <AlertTriangle className="h-3 w-3 mr-1" />
        <span>Incohérence de paiement détectée</span>
      </div>
    </div>
  );
};

export default PaymentDiscrepancyAlert;
