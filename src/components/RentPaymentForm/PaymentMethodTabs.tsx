
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Repeat, Zap, Building } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import StripePaymentOptions from './StripePaymentOptions';
import GoCardlessOptions from './GoCardlessOptions';
import BankAPIOptions from './BankAPIOptions';

interface PaymentMethodTabsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('classic');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset payment method when switching tabs
    onPaymentMethodChange('');
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="classic" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Classique</span>
          </TabsTrigger>
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Stripe</span>
          </TabsTrigger>
          <TabsTrigger value="goCardless" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            <span className="hidden sm:inline">Auto</span>
          </TabsTrigger>
          <TabsTrigger value="bankApi" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Instantané</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classic" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Méthodes de paiement traditionnelles</h3>
            <p className="text-sm text-gray-600 mb-3">
              Virements, chèques, espèces et autres méthodes classiques
            </p>
            <PaymentMethodSelector 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Paiements Stripe</h3>
            <p className="text-sm text-gray-600 mb-3">
              Virements SEPA, cartes bancaires et méthodes européennes
            </p>
            <StripePaymentOptions 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="goCardless" className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Prélèvements automatiques</h3>
            <p className="text-sm text-gray-600 mb-3">
              GoCardless pour les paiements récurrents automatisés
            </p>
            <GoCardlessOptions 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="bankApi" className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">APIs Bancaires (PSD2)</h3>
            <p className="text-sm text-gray-600 mb-3">
              Connexion directe aux banques pour des virements instantanés
            </p>
            <BankAPIOptions 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Informations sur les frais */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-2">💰 Comparaison des frais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-medium text-green-600">✅ Gratuit :</p>
            <ul className="text-gray-600 ml-4">
              <li>• APIs bancaires directes (PSD2)</li>
              <li>• Virements classiques</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-orange-600">💳 Avec frais :</p>
            <ul className="text-gray-600 ml-4">
              <li>• Stripe : 0,35€ à 1,4%</li>
              <li>• GoCardless : 1% + 0,25€</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodTabs;
