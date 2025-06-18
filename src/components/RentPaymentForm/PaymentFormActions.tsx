
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentFormActionsProps {
  onCancel: () => void;
}

const PaymentFormActions: React.FC<PaymentFormActionsProps> = ({ onCancel }) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="px-6 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Enregistrer le Règlement
      </Button>
    </div>
  );
};

export default PaymentFormActions;
