
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Tenant {
  id: string;
  name: string;
  type: string;
  property: string;
  rentAmount: number;
}

interface PaymentAmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  selectedTenantData?: Tenant;
  hasPaymentDiscrepancy: boolean;
}

const PaymentAmountInput: React.FC<PaymentAmountInputProps> = ({
  amount,
  onAmountChange,
  selectedTenantData,
  hasPaymentDiscrepancy
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-green-600" />
        {t('rentManagement.amount')} 
        <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder={selectedTenantData ? selectedTenantData.rentAmount.toString() : "0.00"}
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={`h-12 border-2 transition-colors pl-4 pr-8 text-lg font-semibold ${
            hasPaymentDiscrepancy 
              ? 'border-red-300 hover:border-red-400 focus:border-red-500 bg-red-50' 
              : 'border-gray-200 hover:border-green-300 focus:border-green-500'
          }`}
          required
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">€</span>
      </div>
      
      {/* Payment discrepancy alert */}
      {hasPaymentDiscrepancy && selectedTenantData && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-800 mb-1">Payment discrepancy detected</p>
              <p className="text-red-700">
                Amount entered: <span className="font-semibold">{amount}€</span> • 
                Expected rent: <span className="font-semibold">{selectedTenantData.rentAmount}€</span>
              </p>
              <p className="text-xs text-red-600 mt-1">
                Difference: {Math.abs(parseFloat(amount) - selectedTenantData.rentAmount).toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentAmountInput;
