
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface PaymentFormActionsProps {
  onCancel: () => void;
}

const PaymentFormActions: React.FC<PaymentFormActionsProps> = ({ onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-12 text-sm sm:text-base"
      >
        <X className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        {t('common.cancel')}
      </Button>
      <Button 
        type="submit" 
        className="w-full sm:w-auto order-1 sm:order-2 bg-green-600 hover:bg-green-700 h-10 sm:h-12 text-sm sm:text-base"
      >
        <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        {t('rentManagement.savePayment')}
      </Button>
    </div>
  );
};

export default PaymentFormActions;
