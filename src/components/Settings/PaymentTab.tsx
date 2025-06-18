
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, CreditCard, Building, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PaymentTab: React.FC = () => {
  const { t } = useTranslation();

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
            <Switch id="stripe-enabled" />
            <Label htmlFor="stripe-enabled">{t('settings.payment.stripe.enable')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-public-key">{t('settings.payment.stripe.publicKey')}</Label>
              <Input id="stripe-public-key" placeholder="pk_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">{t('settings.payment.stripe.secretKey')}</Label>
              <Input id="stripe-secret-key" type="password" placeholder="sk_..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="stripe-webhook">{t('settings.payment.stripe.webhookSecret')}</Label>
              <Input id="stripe-webhook" type="password" placeholder="whsec_..." />
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {t('settings.payment.stripe.save')}
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
            <Switch id="paypal-enabled" />
            <Label htmlFor="paypal-enabled">{t('settings.payment.paypal.enable')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-client-id">{t('settings.payment.paypal.clientId')}</Label>
              <Input 
                id="paypal-client-id" 
                placeholder={t('settings.payment.paypal.clientIdPlaceholder')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypal-client-secret">{t('settings.payment.paypal.clientSecret')}</Label>
              <Input 
                id="paypal-client-secret" 
                type="password" 
                placeholder={t('settings.payment.paypal.clientSecretPlaceholder')} 
              />
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {t('settings.payment.paypal.save')}
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
            <Switch id="bank-enabled" />
            <Label htmlFor="bank-enabled">{t('settings.payment.bank.enable')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank-iban">{t('settings.payment.bank.iban')}</Label>
              <Input 
                id="bank-iban" 
                placeholder={t('settings.payment.bank.ibanPlaceholder')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-bic">{t('settings.payment.bank.bic')}</Label>
              <Input 
                id="bank-bic" 
                placeholder={t('settings.payment.bank.bicPlaceholder')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-name">{t('settings.payment.bank.bankName')}</Label>
              <Input 
                id="bank-name" 
                placeholder={t('settings.payment.bank.bankNamePlaceholder')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-holder">{t('settings.payment.bank.accountHolder')}</Label>
              <Input 
                id="account-holder" 
                placeholder={t('settings.payment.bank.accountHolderPlaceholder')} 
              />
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {t('settings.payment.bank.save')}
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
            <Switch id="mobile-enabled" />
            <Label htmlFor="mobile-enabled">{t('settings.payment.mobile.enable')}</Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch id="orange-money" />
              <Label htmlFor="orange-money">{t('settings.payment.mobile.orangeMoney')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="mtn-money" />
              <Label htmlFor="mtn-money">{t('settings.payment.mobile.mtnMoney')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="moov-money" />
              <Label htmlFor="moov-money">{t('settings.payment.mobile.moovMoney')}</Label>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {t('settings.payment.mobile.save')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTab;
