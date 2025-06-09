
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Building, Smartphone, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentTab: React.FC = () => {
  const { toast } = useToast();
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
      title: "Configuration Stripe",
      description: "Configuration Stripe sauvegardée avec succès.",
    });
    console.log('Configuration Stripe:', stripeConfig);
  };

  const handleSavePayPal = () => {
    toast({
      title: "Configuration PayPal",
      description: "Configuration PayPal sauvegardée avec succès.",
    });
    console.log('Configuration PayPal:', paypalConfig);
  };

  const handleSaveBank = () => {
    toast({
      title: "Configuration Bancaire",
      description: "Configuration bancaire sauvegardée avec succès.",
    });
    console.log('Configuration Bancaire:', bankConfig);
  };

  const handleSaveMobile = () => {
    toast({
      title: "Paiement Mobile",
      description: "Configuration paiement mobile sauvegardée avec succès.",
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
            Configuration Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="stripe-enabled">Activer Stripe</Label>
            <Switch 
              id="stripe-enabled"
              checked={stripeConfig.enabled}
              onCheckedChange={(checked) => setStripeConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          {stripeConfig.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stripe-public-key">Clé publique Stripe</Label>
                <Input
                  id="stripe-public-key"
                  placeholder="pk_live_..."
                  value={stripeConfig.publicKey}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret-key">Clé secrète Stripe</Label>
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
                <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                <Input
                  id="stripe-webhook"
                  placeholder="whsec_..."
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                />
              </div>

              <Button onClick={handleSaveStripe} className="w-full">
                Sauvegarder Configuration Stripe
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
            Configuration PayPal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="paypal-enabled">Activer PayPal</Label>
            <Switch 
              id="paypal-enabled"
              checked={paypalConfig.enabled}
              onCheckedChange={(checked) => setPaypalConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          {paypalConfig.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paypal-client-id">Client ID PayPal</Label>
                <Input
                  id="paypal-client-id"
                  placeholder="Votre Client ID PayPal"
                  value={paypalConfig.clientId}
                  onChange={(e) => setPaypalConfig(prev => ({ ...prev, clientId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal-client-secret">Client Secret PayPal</Label>
                <div className="relative">
                  <Input
                    id="paypal-client-secret"
                    type={showPayPalKey ? "text" : "password"}
                    placeholder="Votre Client Secret PayPal"
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
                Sauvegarder Configuration PayPal
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
            Virement Bancaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="bank-enabled">Activer Virement Bancaire</Label>
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
                  <Label htmlFor="bank-iban">IBAN</Label>
                  <Input
                    id="bank-iban"
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    value={bankConfig.iban}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, iban: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-bic">BIC/SWIFT</Label>
                  <Input
                    id="bank-bic"
                    placeholder="BNPAFRPPXXX"
                    value={bankConfig.bic}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, bic: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank-name">Nom de la Banque</Label>
                <Input
                  id="bank-name"
                  placeholder="Nom de votre banque"
                  value={bankConfig.bankName}
                  onChange={(e) => setBankConfig(prev => ({ ...prev, bankName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-holder">Titulaire du Compte</Label>
                <Input
                  id="account-holder"
                  placeholder="Nom du titulaire du compte"
                  value={bankConfig.accountHolder}
                  onChange={(e) => setBankConfig(prev => ({ ...prev, accountHolder: e.target.value }))}
                />
              </div>

              <Button onClick={handleSaveBank} className="w-full">
                Sauvegarder Configuration Bancaire
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
            Paiement Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mobile-enabled">Activer Paiement Mobile</Label>
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
                  <Label htmlFor="orange-money">Orange Money</Label>
                  <Switch 
                    id="orange-money"
                    checked={mobileConfig.orangeMoney}
                    onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, orangeMoney: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mtn-money">MTN Mobile Money</Label>
                  <Switch 
                    id="mtn-money"
                    checked={mobileConfig.mtnMoney}
                    onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, mtnMoney: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="moov-money">Moov Money</Label>
                  <Switch 
                    id="moov-money"
                    checked={mobileConfig.moovMoney}
                    onCheckedChange={(checked) => setMobileConfig(prev => ({ ...prev, moovMoney: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveMobile} className="w-full">
                Sauvegarder Configuration Mobile
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTab;
