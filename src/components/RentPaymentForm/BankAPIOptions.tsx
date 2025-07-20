
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Building, Shield, Clock, Globe, Smartphone } from 'lucide-react';
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
          <SelectValue placeholder="Sélectionnez votre banque ou service" />
        </SelectTrigger>
        <SelectContent>
          {/* Banques françaises */}
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
          <SelectItem value="la_banque_postale_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-yellow-600" />
              La Banque Postale API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="credit_mutuel_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              Crédit Mutuel API - Gratuit
            </div>
          </SelectItem>

          {/* Banques digitales */}
          <SelectItem value="revolut_api" className="py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-400" />
              Revolut API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="n26_api" className="py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-teal-500" />
              N26 API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="boursorama_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-orange-600" />
              Boursorama API - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="fortuneo_api" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-600" />
              Fortuneo API - Gratuit
            </div>
          </SelectItem>

          {/* Services d'agrégation */}
          <SelectItem value="bridge_api" className="py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Bridge API (Multi-banques) - Sur devis
            </div>
          </SelectItem>
          <SelectItem value="bankin_api" className="py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Bankin' API (Agrégateur) - Sur devis
            </div>
          </SelectItem>
          <SelectItem value="budget_insight_api" className="py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Budget Insight API - Sur devis
            </div>
          </SelectItem>

          {/* Solutions de paiement instantané */}
          <SelectItem value="lydia_pro_api" className="py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-pink-600" />
              Lydia Pro (Instantané) - 0,5%
            </div>
          </SelectItem>
          <SelectItem value="paylib_api" className="py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              Paylib (Banques françaises) - Gratuit
            </div>
          </SelectItem>

          {/* Banques européennes */}
          <SelectItem value="ing_api" className="py-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-500" />
              ING Bank API (Europe) - Gratuit
            </div>
          </SelectItem>
          <SelectItem value="rabobank_api" className="py-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Rabobank API (Pays-Bas) - Gratuit
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <div className="text-xs text-yellow-800">
          <p className="font-medium mb-1">⚡ Virements instantanés et APIs bancaires :</p>
          <ul className="space-y-1">
            <li>• <strong>APIs directes</strong> : Connexion sécurisée via PSD2</li>
            <li>• <strong>Délai</strong> : Moins de 10 secondes pour les virements instantanés</li>
            <li>• <strong>Limite</strong> : 15 000€ par virement (selon la banque)</li>
            <li>• <strong>Disponibilité</strong> : 24h/24, 7j/7 pour la plupart</li>
            <li>• <strong>Sécurité</strong> : Authentification forte via votre banque</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BankAPIOptions;
