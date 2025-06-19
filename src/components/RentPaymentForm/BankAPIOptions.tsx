
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Building, Shield, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BankAPIOptionsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const BankAPIOptions: React.FC<BankAPIOptionsProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="bankApiMethod" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Zap className="h-4 w-4 text-yellow-600" />
        APIs Bancaires (PSD2)
        <span className="text-red-500">*</span>
      </Label>
      <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-yellow-300 focus:border-yellow-500 transition-colors">
          <SelectValue placeholder="Sélectionnez votre banque" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bnp_paribas_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              BNP Paribas API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="credit_agricole_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              Crédit Agricole API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="societe_generale_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-red-600" />
              Société Générale API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="lcl_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              LCL API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="bridge_api" className="py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Bridge API (Multi-banques) - Sur devis
            </div>
          </SelectItem>
          <SelectItem value="lydia_pro_api" className="py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-pink-600" />
              Lydia Pro (Instantané) - 0,5%
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <div className="text-xs text-yellow-800">
          <p className="font-medium mb-1">⚡ Virements instantanés (24/7) :</p>
          <ul className="space-y-1">
            <li>• <strong>Délai</strong> : Moins de 10 secondes</li>
            <li>• <strong>Limite</strong> : 15 000€ par virement</li>
            <li>• <strong>Disponibilité</strong> : 24h/24, 7j/7</li>
            <li>• <strong>Authentification</strong> : Via votre banque</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BankAPIOptions;
