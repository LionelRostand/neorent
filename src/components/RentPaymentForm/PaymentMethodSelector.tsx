
import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="paymentMethod" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-blue-600" />
        Mode de Paiement 
        <span className="text-red-500">*</span>
      </Label>
      <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
          <SelectValue placeholder="Sélectionner le mode de paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="virement" className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Virement bancaire
            </div>
          </SelectItem>
          <SelectItem value="cheque" className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              Chèque
            </div>
          </SelectItem>
          <SelectItem value="especes" className="py-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              Espèces
            </div>
          </SelectItem>
          <SelectItem value="carte" className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600" />
              Carte bancaire
            </div>
          </SelectItem>
          <SelectItem value="prelevement" className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Prélèvement automatique
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentMethodSelector;
