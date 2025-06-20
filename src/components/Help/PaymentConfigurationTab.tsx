
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Building, 
  Smartphone, 
  Repeat, 
  Zap,
  AlertCircle,
  CheckCircle,
  Settings,
  Key,
  Globe
} from 'lucide-react';

const PaymentConfigurationTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('help.paymentConfig')}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          {t('help.paymentConfigDescription')}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="bank">Virements</TabsTrigger>
          <TabsTrigger value="mobile">Paiements mobiles</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Stripe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Cartes bancaires, virements SEPA, et autres méthodes européennes
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">Cartes bancaires</Badge>
                  <Badge variant="secondary">SEPA</Badge>
                  <Badge variant="secondary">iDEAL</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Frais : 0,35€ à 1,4% par transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                  PayPal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Paiements via PayPal et cartes associées
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">PayPal Balance</Badge>
                  <Badge variant="secondary">Cartes liées</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Frais : 2,9% + 0,35€ par transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-600" />
                  Virements bancaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Virements traditionnels et APIs bancaires PSD2
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">IBAN</Badge>
                  <Badge variant="secondary">PSD2</Badge>
                  <Badge variant="secondary">Instantané</Badge>
                </div>
                <p className="text-xs text-green-600 mt-3">
                  ✅ Gratuit pour les virements classiques
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  Paiements mobiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Solutions de paiement mobile africaines
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">Orange Money</Badge>
                  <Badge variant="secondary">MTN Money</Badge>
                  <Badge variant="secondary">Moov Money</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Frais variables selon l'opérateur
                </p>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5 text-indigo-600" />
                  Prélèvements automatiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  GoCardless pour les paiements récurrents
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">SEPA Direct Debit</Badge>
                  <Badge variant="secondary">Récurrent</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Frais : 1% + 0,25€ par transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  APIs bancaires instantanées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Connexion directe aux banques européennes
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">PSD2</Badge>
                  <Badge variant="secondary">Temps réel</Badge>
                </div>
                <p className="text-xs text-green-600 mt-3">
                  ✅ Gratuit (hors frais bancaires)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Configuration Stripe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Étapes de configuration</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>Créer un compte Stripe sur <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline">stripe.com</a></li>
                  <li>Récupérer vos clés API dans le tableau de bord Stripe</li>
                  <li>Aller dans Paramètres → Paiements dans l'application</li>
                  <li>Activer Stripe et saisir vos clés</li>
                  <li>Configurer les webhooks (optionnel)</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Clés requises :</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Clé publique (pk_...)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Clé secrète (sk_...)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Secret webhook (whsec_...)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Méthodes supportées :</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Cartes Visa, Mastercard, Amex</div>
                    <div>• Virements SEPA</div>
                    <div>• iDEAL (Pays-Bas)</div>
                    <div>• Bancontact (Belgique)</div>
                    <div>• SOFORT (Allemagne)</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Utilisez les clés de test en mode développement, puis basculez vers les clés live en production.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paypal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-yellow-600" />
                Configuration PayPal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">Étapes de configuration</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                  <li>Créer un compte développeur PayPal</li>
                  <li>Créer une application dans le tableau de bord</li>
                  <li>Récupérer Client ID et Client Secret</li>
                  <li>Configurer dans Paramètres → Paiements</li>
                  <li>Tester avec le sandbox PayPal</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Avantages :</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Reconnaissance mondiale</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Protection acheteur/vendeur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Interface familière</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Inconvénients :</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Frais plus élevés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Risque de gel de fonds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Processus de validation</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-green-600" />
                Configuration des virements bancaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Configuration manuelle</h3>
                <p className="text-sm text-green-800 mb-3">
                  Pour les virements traditionnels, configurez vos coordonnées bancaires :
                </p>
                <div className="space-y-2 text-sm text-green-800">
                  <div>• IBAN du compte destinataire</div>
                  <div>• Code BIC/SWIFT</div>
                  <div>• Nom de la banque</div>
                  <div>• Titulaire du compte</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">APIs bancaires instantanées (PSD2)</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Connexion directe avec les banques européennes pour des virements en temps réel :
                </p>
                <div className="space-y-2 text-sm text-blue-800">
                  <div>• Pas de frais de transaction</div>
                  <div>• Confirmation instantanée</div>
                  <div>• Sécurité bancaire native</div>
                  <div>• Disponible dans l'UE</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-gray-100 p-3 rounded-lg mb-2">
                    <Building className="h-8 w-8 text-gray-600 mx-auto" />
                  </div>
                  <h4 className="font-medium text-sm">Virement classique</h4>
                  <p className="text-xs text-gray-600">1-3 jours ouvrés</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-lg mb-2">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <h4 className="font-medium text-sm">Virement instantané</h4>
                  <p className="text-xs text-gray-600">Temps réel</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-lg mb-2">
                    <Globe className="h-8 w-8 text-green-600 mx-auto" />
                  </div>
                  <h4 className="font-medium text-sm">API PSD2</h4>
                  <p className="text-xs text-gray-600">Sécurisé</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-6 w-6 text-purple-600" />
                Paiements mobiles africains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">Orange Money</h3>
                  <div className="space-y-2 text-sm text-orange-800">
                    <div>• Burkina Faso, Mali, Niger</div>
                    <div>• Côte d'Ivoire, Sénégal</div>
                    <div>• API Orange Money</div>
                    <div>• Frais : 1-3%</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">MTN Money</h3>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <div>• Ghana, Uganda, Rwanda</div>
                    <div>• Cameroun, Bénin</div>
                    <div>• API MTN MoMo</div>
                    <div>• Frais : 1-2,5%</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Moov Money</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>• Burkina Faso, Bénin</div>
                    <div>• Côte d'Ivoire, Togo</div>
                    <div>• API Moov Money</div>
                    <div>• Frais : 1-3%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Settings className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Configuration requise</h4>
                    <div className="text-sm text-purple-700 mt-1 space-y-1">
                      <div>• Accord commercial avec l'opérateur</div>
                      <div>• Clés API spécifiques</div>
                      <div>• Tests en environnement sandbox</div>
                      <div>• Validation par l'opérateur</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration avancée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Webhooks et notifications</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Configuration des URLs de callback</div>
                  <div>• Gestion des événements de paiement</div>
                  <div>• Mise à jour automatique des statuts</div>
                  <div>• Notifications en temps réel</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Sécurité et conformité</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div>• Certificats SSL/TLS obligatoires</div>
                  <div>• Conformité PCI DSS</div>
                  <div>• Chiffrement des données sensibles</div>
                  <div>• Audit des transactions</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-3">Tests et déploiement</h3>
                <div className="space-y-2 text-sm text-yellow-800">
                  <div>• Environnements de test (sandbox)</div>
                  <div>• Cartes de test pour Stripe</div>
                  <div>• Comptes PayPal de test</div>
                  <div>• Validation avant production</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentConfigurationTab;
