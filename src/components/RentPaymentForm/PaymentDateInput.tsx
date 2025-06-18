
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PaymentDateInputProps {
  paymentDate: string;
  onPaymentDateChange: (date: string) => void;
}

const PaymentDateInput: React.FC<PaymentDateInputProps> = ({
  paymentDate,
  onPaymentDateChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="paymentDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-blue-600" />
        {t('rentManagement.paymentDate')} 
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id="paymentDate"
        type="date"
        value={paymentDate}
        onChange={(e) => onPaymentDateChange(e.target.value)}
        className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
        required
      />
    </div>
  );
};

export default PaymentDateInput;
