
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface PaymentActionsProps {
  status: string;
  onMarkAsPaid: () => void;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ status, onMarkAsPaid }) => {
  if (status === 'Payé') {
    return null;
  }

  return (
    <div className="pt-3 sm:pt-4 border-t border-gray-100 space-y-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full hover:bg-blue-50 text-xs sm:text-sm"
      >
        Envoyer rappel
      </Button>
      <Button 
        size="sm" 
        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
        onClick={onMarkAsPaid}
      >
        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Marquer comme payé
      </Button>
    </div>
  );
};

export default PaymentActions;
