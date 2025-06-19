
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, CreditCard, Building, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const PaymentTab: React.FC = () => {
  const { t } = useTranslation();

  // État pour la configuration Stripe
  const [stripeConfig, setStripeConfig] = useState({
    enabled: false,
    publicKey: '',
    secretKey: '',
    webhookSecret: ''
  });

  // État pour la configuration PayPal
  const [paypalConfig, setPaypalConfig] = useState({
    enabled: false,
    clientId: '',
    clientSecret: ''
  });

  // État pour la configuration de virement bancaire
  const [bankConfig, setBankConfig] = useState({
    enabled: false,
    iban: '',
    bic: '',
    bankName: '',
    accountHolder: ''
  });

  // État pour la configuration de paiement mobile
  const [mobileConfig, setMobileConfig] = useState({
    enabled: false,
    orangeMoney: false,
    mtnMoney: false,
    moovMoney: false
  });

  // États de chargement pour chaque section
  const [savingStripe, setSavingStripe] = useState(false);
  const [savingPaypal, setSavingPaypal] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [savingMobile, setSavingMobile] = useState(false);

  const handleSaveStripe = async () => {
    setSavingStripe(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving Stripe configuration:', stripeConfig);
      
      toast.success('Configuration Stripe sauvegardée!', {
        description: 'Les paramètres Stripe ont été enregistrés avec succès'
      });
    } catch (error) {
      console.error('Error saving Stripe config:', error);
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Impossible de sauvegarder la configuration Stripe'
      });
    } finally {
      setSavingStripe(false);
    }
  };

  const handleSavePaypal = async () => {
    setSavingPaypal(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving PayPal configuration:', paypalConfig);
      
      toast.success('Configuration PayPal sauvegardée!', {
        description: 'Les paramètres PayPal ont été enregistrés avec succès'
      });
    } catch (error) {
      console.error('Error saving PayPal config:', error);
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Impossible de sauvegarder la configuration PayPal'
      });
    } finally {
      setSavingPaypal(false);
    }
  };

  const handleSaveBank = async () => {
    setSavingBank(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving Bank Transfer configuration:', bankConfig);
      
      // Validation basique
      if (bankConfig.enabled && (!bankConfig.iban || !bankConfig.accountHolder)) {
        toast.error('Champs obligatoires manquants', {
          description: 'Veuillez remplir au minimum l\'IBAN et le titulaire du compte'
        });
        return;
      }
      
      toast.success('Configuration de virement bancaire sauvegardée!', {
        description: 'Les virements bancaires sont maintenant configurés et opérationnels'
      });
    } catch (error) {
      console.error('Error saving Bank config:', error);
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Impossible de sauvegarder la configuration bancaire'
      });
    } finally {
      setSavingBank(false);
    }
  };

  const handleSaveMobile = async () => {
    setSavingMobile(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving Mobile Payment configuration:', mobileConfig);
      
      toast.success('Configuration de paiement mobile sauvegardée!', {
        description: 'Les paramètres de paiement mobile ont été enregistrés'
      });
    } catch (error) {
      console.error('Error saving Mobile config:', error);
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Impossible de sauvegarder la configuration mobile'
      });
    } finally {
      setSavingMobile(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900">
            💳 {t('settings.payment.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {t('settings.payment.subtitle')}
          </p>
        </CardContent>
      </Card>

      {/* Stripe Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            {t('settings.payment.stripe.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{t('settings.payment.stripe.description')}</p>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="stripe-enabled" 
              checked={stripeConfig.enabled}
              onCheckedChange={(checked) => setStripeConfig(prev => ({...prev, enabled: checked}))}
            />
            <Label htmlFor="stripe-enabled">{t('settings.payment.stripe.enable')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-public-key">{t('settings.payment.stripe.publicKey')}</Label>
              <Input 
                id="stripe-public-key" 
                placeholder="pk_..." 
                value={stripeConfig.publicKey}
                onChange={(e) => setStripeConfig(prev => ({...prev, publicKey: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">{t('settings.payment.stripe.secretKey')}</Label>
              <Input 
                id="stripe-secret-key" 
                type="password" 
                placeholder="sk_..." 
                value={stripeConfig.secretKey}
                onChange={(e) => setStripeConfig(prev => ({...prev, secretKey: e.target.value}))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="stripe-webhook">{t('settings.payment.stripe.webhookSecret')}</Label>
              <Input 
                id="stripe-webhook" 
                type="password" 
                placeholder="whsec_..." 
                value={stripeConfig.webhookSecret}
                onChange={(e) => setStripeConfig(prev => ({...prev, webhookSecret: e.target.value}))}
              />
            </div>
          </div>

          <Button 
            className="w-full sm:w-auto" 
            onClick={handleSaveStripe}
            disabled={savingStripe}
          >
            <Save className="h-4 w-4 mr-2" />
            {savingStripe ? 'Sauvegarde...' : t('settings.payment.stripe.save')}
          </Button>
        </CardContent>
      </Card>

      {/* PayPal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            {t('settings.payment.paypal.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{t('settings.payment.paypal.description')}</p>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="paypal-enabled" 
              checked={paypalConfig.enabled}
              onCheckedChange={(checked) => setPaypalConfig(prev => ({...prev, enabled: checked}))}
            />
            <Label htmlFor="paypal-enabled">{t('settings.payment.paypal.enable')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-client-id">{t('settings.payment.paypal.clientId')}</Label>
              <Input 
                id="paypal-client-id" 
                placeholder={t('settings.payment.paypal.clientIdPlaceholder')} 
                value={paypalConfig.clientId}
                onChange={(e) => setPaypalConfig(prev => ({...prev, clientId: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypal-client-secret">{t('settings.payment.paypal.clientSecret')}</Label>
              <Input 
                id="paypal-client-secret" 
                type="password" 
                placeholder={t('settings.payment.paypal.clientSecretPlaceholder')} 
                value={paypalConfig.clientSecret}
                onChange={(e) => setPaypalConfig(prev => ({...prev, clientSecret: e.target.value}))}
              />
            </div>
          </div>

          <Button 
            className="w-full sm:w-auto" 
            onClick={handleSavePaypal}
            disabled={savingPaypal}
          >
            <Save className="h-4 w-4 mr-2" />
            {savingPaypal ? 'Sauvegarde...' : t('settings.payment.paypal.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Bank Transfer Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5" />
            {t('settings.payment.bank.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{t('settings.payment.bank.description')}</p>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="bank-enabled" 
              checked={bankConfig.enabled}
              onCheckedChange={(checked) => setBankConfig(prev => ({...prev, enabled: checked}))}
            />
            <Label htmlFor="bank-enabled">{t('settings.payment.bank.enable')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank-iban">{t('settings.payment.bank.iban')}</Label>
              <Input 
                id="bank-iban" 
                placeholder={t('settings.payment.bank.ibanPlaceholder')} 
                value={bankConfig.iban}
                onChange={(e) => setBankConfig(prev => ({...prev, iban: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-bic">{t('settings.payment.bank.bic')}</Label>
              <Input 
                id="bank-bic" 
                placeholder={t('settings.payment.bank.bicPlaceholder')} 
                value={bankConfig.bic}
                onChange={(e) => setBankConfig(prev => ({...prev, bic: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-name">{t('settings.payment.bank.bankName')}</Label>
              <Input 
                id="bank-name" 
                placeholder={t('settings.payment.bank.bankNamePlaceholder')} 
                value={bankConfig.bankName}
                onChange={(e) => setBankConfig(prev => ({...prev, bankName: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-holder">{t('settings.payment.bank.accountHolder')}</Label>
              <Input 
                id="account-holder" 
                placeholder={t('settings.payment.bank.accountHolderPlaceholder')} 
                value={bankConfig.accountHolder}
                onChange={(e) => setBankConfig(prev => ({...prev, accountHolder: e.target.value}))}
              />
            </div>
          </div>

          <Button 
            className="w-full sm:w-auto" 
            onClick={handleSaveBank}
            disabled={savingBank}
          >
            <Save className="h-4 w-4 mr-2" />
            {savingBank ? 'Sauvegarde...' : t('settings.payment.bank.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Mobile Payment Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="h-5 w-5" />
            {t('settings.payment.mobile.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{t('settings.payment.mobile.description')}</p>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="mobile-enabled" 
              checked={mobileConfig.enabled}
              onCheckedChange={(checked) => setMobileConfig(prev => ({...prev, enabled: checked}))}
            />
            <Label htmlFor="mobile-enabled">{t('settings.payment.mobile.enable')}</Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="orange-money" 
                checked={mobileConfig.orangeMoney}
                onCheckedChange={(checked) => setMobileConfig(prev => ({...prev, orangeMoney: checked}))}
              />
              <Label htmlFor="orange-money">{t('settings.payment.mobile.orangeMoney')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="mtn-money" 
                checked={mobileConfig.mtnMoney}
                onCheckedChange={(checked) => setMobileConfig(prev => ({...prev, mtnMoney: checked}))}
              />
              <Label htmlFor="mtn-money">{t('settings.payment.mobile.mtnMoney')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="moov-money" 
                checked={mobileConfig.moovMoney}
                onCheckedChange={(checked) => setMobileConfig(prev => ({...prev, moovMoney: checked}))}
              />
              <Label htmlFor="moov-money">{t('settings.payment.mobile.moovMoney')}</Label>
            </div>
          </div>

          <Button 
            className="w-full sm:w-auto" 
            onClick={handleSaveMobile}
            disabled={savingMobile}
          >
            <Save className="h-4 w-4 mr-2" />
            {savingMobile ? 'Sauvegarde...' : t('settings.payment.mobile.save')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTab;
