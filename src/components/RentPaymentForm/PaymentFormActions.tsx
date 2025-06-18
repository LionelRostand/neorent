
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentFormActionsProps {
  onCancel: () => void;
}

const PaymentFormActions: React.FC<PaymentFormActionsProps> = ({ onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="px-6 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
      >
        {t('common.cancel')}
      </Button>
      <Button 
        type="submit" 
        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <DollarSign className="mr-2 h-4 w-4" />
        {t('rentManagement.savePayment')}
      </Button>
    </div>
  );
};

export default PaymentFormActions;
