
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Building, Smartphone, Globe, Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StripePaymentOptionsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const StripePaymentOptions: React.FC<StripePaymentOptionsProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="stripePaymentMethod" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-blue-600" />
        Méthodes de paiement Stripe
        <span className="text-red-500">*</span>
      </Label>
      <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
          <SelectValue placeholder="Sélectionnez une méthode de paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stripe_sepa_debit" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              Virement SEPA (Stripe) - 0,35€
            </div>
          </SelectItem>
          <SelectItem value="stripe_card" className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              Carte bancaire (Stripe) - 1,4% + 0,25€
            </div>
          </SelectItem>
          <SelectItem value="stripe_sofort" className="py-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-600" />
              Sofort (Virement instantané) - 1,3%
            </div>
          </SelectItem>
          <SelectItem value="stripe_ideal" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-600" />
              iDEAL (Pays-Bas) - 0,29€
            </div>
          </SelectItem>
          <SelectItem value="stripe_bancontact" className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Bancontact (Belgique) - 0,29€
            </div>
          </SelectItem>
          <SelectItem value="stripe_giropay" className="py-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-red-600" />
              Giropay (Allemagne) - 1,3%
            </div>
          </SelectItem>
          <SelectItem value="stripe_paypal" className="py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500" />
              PayPal (via Stripe) - 3,4% + 0,35€
            </div>
          </SelectItem>
          <SelectItem value="stripe_apple_pay" className="py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-gray-800" />
              Apple Pay - 1,4% + 0,25€
            </div>
          </SelectItem>
          <SelectItem value="stripe_google_pay" className="py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-500" />
              Google Pay - 1,4% + 0,25€
            </div>
          </SelectItem>
          <SelectItem value="stripe_alipay" className="py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-400" />
              Alipay - 2,95%
            </div>
          </SelectItem>
          <SelectItem value="stripe_wechat" className="py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-green-500" />
              WeChat Pay - 2,95%
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="text-xs text-blue-800">
          <p className="font-medium mb-1">💡 Informations sur les frais Stripe :</p>
          <ul className="space-y-1">
            <li>• <strong>SEPA</strong> : Idéal pour les virements européens (délai 1-3 jours)</li>
            <li>• <strong>Cartes</strong> : Paiement instantané avec frais variables</li>
            <li>• <strong>Portefeuilles digitaux</strong> : Apple Pay, Google Pay, PayPal</li>
            <li>• <strong>Paiements internationaux</strong> : Alipay, WeChat Pay</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentOptions;
