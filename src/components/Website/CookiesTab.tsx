
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  Cookie, 
  Shield, 
  Eye, 
  Settings as SettingsIcon,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const CookiesTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  
  // États pour la configuration des cookies
  const [cookieSettings, setCookieSettings] = useState({
    bannerEnabled: true,
    bannerText: "Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et personnaliser le contenu.",
    necessaryCookies: true,
    analyticsCookies: false,
    marketingCookies: false,
    functionalCookies: false,
    cookieExpiry: 365,
    bannerPosition: 'bottom',
    bannerStyle: 'modern'
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Sauvegarde des paramètres cookies:', cookieSettings);
      toast.success('Configuration des cookies sauvegardée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Cookies</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Configurez la politique de cookies et les bannières de consentement
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration principale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cookie className="h-5 w-5" />
              Configuration générale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="banner-enabled" className="text-sm sm:text-base">Activer la bannière de cookies</Label>
              <Switch
                id="banner-enabled"
                checked={cookieSettings.bannerEnabled}
                onCheckedChange={(checked) => 
                  setCookieSettings(prev => ({...prev, bannerEnabled: checked}))
                }
              />
            </div>

            <div>
              <Label htmlFor="banner-text" className="text-sm sm:text-base">Texte de la bannière</Label>
              <Textarea
                id="banner-text"
                rows={3}
                value={cookieSettings.bannerText}
                onChange={(e) => 
                  setCookieSettings(prev => ({...prev, bannerText: e.target.value}))
                }
                className="mt-1 text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="cookie-expiry" className="text-sm sm:text-base">Durée de validité (jours)</Label>
              <Input
                id="cookie-expiry"
                type="number"
                value={cookieSettings.cookieExpiry}
                onChange={(e) => 
                  setCookieSettings(prev => ({...prev, cookieExpiry: parseInt(e.target.value)}))
                }
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Types de cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <SettingsIcon className="h-5 w-5" />
              Types de cookies autorisés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm sm:text-base">Cookies nécessaires</Label>
                <p className="text-xs sm:text-sm text-gray-500">Indispensables au fonctionnement</p>
              </div>
              <Switch
                checked={cookieSettings.necessaryCookies}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm sm:text-base">Cookies analytiques</Label>
                <p className="text-xs sm:text-sm text-gray-500">Mesure d'audience</p>
              </div>
              <Switch
                checked={cookieSettings.analyticsCookies}
                onCheckedChange={(checked) => 
                  setCookieSettings(prev => ({...prev, analyticsCookies: checked}))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm sm:text-base">Cookies marketing</Label>
                <p className="text-xs sm:text-sm text-gray-500">Publicités personnalisées</p>
              </div>
              <Switch
                checked={cookieSettings.marketingCookies}
                onCheckedChange={(checked) => 
                  setCookieSettings(prev => ({...prev, marketingCookies: checked}))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm sm:text-base">Cookies fonctionnels</Label>
                <p className="text-xs sm:text-sm text-gray-500">Fonctionnalités avancées</p>
              </div>
              <Switch
                checked={cookieSettings.functionalCookies}
                onCheckedChange={(checked) => 
                  setCookieSettings(prev => ({...prev, functionalCookies: checked}))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages légales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Pages légales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-between text-xs sm:text-sm" asChild>
              <a href="/legal-notice" target="_blank">
                Mentions légales
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-between text-xs sm:text-sm" asChild>
              <a href="/privacy-policy" target="_blank">
                Politique de confidentialité
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-between text-xs sm:text-sm sm:col-span-2 lg:col-span-1" asChild>
              <a href="/cookie-policy" target="_blank">
                Politique de cookies
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5" />
            Aperçu de la bannière
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cookieSettings.bannerEnabled ? (
            <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <Cookie className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Nous utilisons des cookies</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{cookieSettings.bannerText}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto whitespace-nowrap">
                      Paramètres
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto">
                      Nécessaires uniquement
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-auto">
                      Accepter tout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Cookie className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm sm:text-base">La bannière de cookies est désactivée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiesTab;
