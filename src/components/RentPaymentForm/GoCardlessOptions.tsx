
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Repeat, Building, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoCardlessOptionsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const GoCardlessOptions: React.FC<GoCardlessOptionsProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="goCardlessMethod" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Repeat className="h-4 w-4 text-green-600" />
        Prélèvements automatiques GoCardless
        <span className="text-red-500">*</span>
      </Label>
      <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors">
          <SelectValue placeholder="Sélectionnez un type de prélèvement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="goCardless_sepa_core" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              SEPA Core (Standard) - 1% + 0,25€
            </div>
          </SelectItem>
          <SelectItem value="goCardless_sepa_b2b" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              SEPA B2B (Entreprises) - 1% + 0,25€
            </div>
          </SelectItem>
          <SelectItem value="goCardless_instant_bank_pay" className="py-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Instant Bank Pay - 0,5% + 0,25€
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
        <div className="text-xs text-green-800">
          <p className="font-medium mb-1">🔄 Prélèvements automatiques :</p>
          <ul className="space-y-1">
            <li>• <strong>SEPA Core</strong> : Pour particuliers (délai 3-5 jours)</li>
            <li>• <strong>SEPA B2B</strong> : Pour entreprises (plus rapide)</li>
            <li>• <strong>Instant Pay</strong> : Confirmation immédiate</li>
            <li>• <strong>Mandat</strong> : Signature électronique requise</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoCardlessOptions;
