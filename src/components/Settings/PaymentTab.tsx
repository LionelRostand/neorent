
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Building, Smartphone, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const PaymentTab: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [showPayPalKey, setShowPayPalKey] = useState(false);
  
  // États pour les configurations de paiement
  const [stripeConfig, setStripeConfig] = useState({
    enabled: false,
    publicKey: '',
    secretKey: '',
    webhookSecret: ''
  });

  const [paypalConfig, setPaypalConfig] = useState({
    enabled: false,
    clientId: '',
    clientSecret: ''
  });

  const [bankConfig, setBankConfig] = useState({
    enabled: true,
    iban: '',
    bic: '',
    bankName: '',
    accountHolder: ''
  });

  const [mobileConfig, setMobileConfig] = useState({
    enabled: false,
    orangeMoney: false,
    mtnMoney: false,
    moovMoney: false
  });

  const handleSaveStripe = () => {
    toast({
      title: t('settings.payment.stripe.title'),
      description: t('settings.payment.stripe.saveSuccess'),
    });
    console.log('Configuration Stripe:', stripeConfig);
  };

  const handleSavePayPal = () => {
    toast({
      title: t('settings.payment.paypal.title'),
      description: t('settings.payment.paypal.saveSuccess'),
    });
    console.log('Configuration PayPal:', paypalConfig);
  };

  const handleSaveBank = () => {
    toast({
      title: t('settings.payment.bank.title'),
      description: t('settings.payment.bank.saveSuccess'),
    });
    console.log('Configuration Bancaire:', bankConfig);
  };

  const handleSaveMobile = () => {
    toast({
      title: t('settings.payment.mobile.title'),
      description: t('settings.payment.mobile.saveSuccess'),
    });
    console.log('Configuration Mobile:', mobileConfig);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Stripe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            {t('settings.payment.stripe.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="stripe-enabled">{t('settings.payment.stripe.enable')}</Label>
            <Switch 
              id="stripe-enabled"
              checked={stripeConfig.enabled}
              onCheckedChange={(checked) => setStripeConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          {stripeConfig.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stripe-public-key">{t('settings.payment.stripe.publicKey')}</Label>
                <Input
                  id="stripe-public-key"
                  placeholder="pk_live_..."
                  value={stripeConfig.publicKey}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret-key">{t('settings.payment.stripe.secretKey')}</Label>
                <div className="relative">
                  <Input
                    id="stripe-secret-key"
                    type={showStripeKey ? "text" : "password"}
                    placeholder="sk_live_..."
                    value={stripeConfig.secretKey}
                    onChange={(e) => setStripeConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowStripeKey(!showStripeKey)}
                  >
                    {showStripeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-webhook">{t('settings.payment.stripe.webhookSecret')}</Label>
                <Input
                  id="stripe-webhook"
                  placeholder="whsec_..."
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                />
              </div>

              <Button onClick={handleSaveStripe} className="w-full">
                {t('settings.payment.stripe.save')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuration PayPal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>
            {t('settings.payment.paypal.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="paypal-enabled">{t('settings.payment.paypal.enable')}</Label>
            <Switch 
              id="paypal-enabled"
              checked={paypalConfig.enabled}
              onCheckedChange={(checked) => setPaypalConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          {paypalConfig.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paypal-client-id">{t('settings.payment.paypal.clientId')}</Label>
                <Input
                  id="paypal-client-id"
                  placeholder={t('settings.payment.paypal.clientIdPlaceholder')}
                  value={paypalConfig.clientId}
                  onChange={(e) => setPaypalConfig(prev => ({ ...prev, clientId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal-client-secret">{t('settings.payment.paypal.clientSecret')}</Label>
                <div className="relative">
                  <Input
                    id="paypal-client-secret"
                    type={showPayPalKey ? "text" : "password"}
                    placeholder={t('settings.payment.paypal.clientSecretPlaceholder')}
                    value={paypalConfig.clientSecret}
                    onChange={(e) => setPaypalConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPayPalKey(!showPayPalKey)}
                  >
                    {showPayPalKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={handleSavePayPal} className="w-full">
                {t('settings.payment.paypal.save')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuration Bancaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            {t('settings.payment.bank.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="bank-enabled">{t('settings.payment.bank.enable')}</Label>
            <Switch 
              id="bank-enabled"
              checked={bankConfig.enabled}
              onCheckedChange={(checked) => setBankConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          {bankConfig.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-iban">{t('settings.payment.bank.iban')}</Label>
                  <Input
                    id="bank-iban"
                    placeholder={t('settings.payment.bank.ibanPlaceholder')}
                    value={bankConfig.iban}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, iban: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-bic">{t('settings.payment.bank.bic')}</Label>
                  <Input
                    id="bank-bic"
                    placeholder={t('settings.payment.bank.bicPlaceholder')}
                    value={bankConfig.bic}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, bic: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank-name">{t('settings.payment.bank.bankName')}</Label>
                <Input
                  id="bank-name"
                  placeholder={t('settings.payment.bank.bankNamePlaceholder')}
                  value={bankConfig.bankName}
                  onChange={(e) => setBankConfig(prev => ({ ...prev, bankName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-holder">{t('settings.payment.bank.accountHolder')}</Label>
                <Input
                  id="account-holder"
                  placeholder={t('settings.payment.bank.accountHolderPlaceholder')}
                  value={bankConfig.accountHolder}
                  onChange={(e) => setBankConfig(prev => ({ ...prev, accountHolder: e.target.value }))}
                />
              </div>

              <Button onClick={handleSaveBank} className="w-full">
                {t('settings.payment.bank.save')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Paiement Mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-orange-600" />
            {t('settings.payment.mobile.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mobile-enabled">{t('settings.payment.mobile.enable')}</Label>
            <Switch 
              id="mobile-enabled"
              checked={mobileConfig.enabled}
              onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          {mobileConfig.enabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="orange-money">{t('settings.payment.mobile.orangeMoney')}</Label>
                  <Switch 
                    id="orange-money"
                    checked={mobileConfig.orangeMoney}
                    onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, orangeMoney: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mtn-money">{t('settings.payment.mobile.mtnMoney')}</Label>
                  <Switch 
                    id="mtn-money"
                    checked={mobileConfig.mtnMoney}
                    onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, mtnMoney: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="moov-money">{t('settings.payment.mobile.moovMoney')}</Label>
                  <Switch 
                    id="moov-money"
                    checked={mobileConfig.moovMoney}
                    onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, moovMoney: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveMobile} className="w-full">
                {t('settings.payment.mobile.save')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTab;
