
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Save, Cookie, Eye, Code, Settings } from 'lucide-react';
import { toast } from 'sonner';

const CookiesTab = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    enabled: true,
    showBanner: true,
    bannerPosition: 'bottom',
    bannerText: 'Ce site utilise des cookies pour améliorer votre expérience de navigation. En continuant à utiliser ce site, vous acceptez notre utilisation des cookies.',
    acceptButtonText: 'Accepter',
    declineButtonText: 'Refuser',
    policyLinkText: 'Politique de cookies',
    policyUrl: '/politique-cookies',
    analyticsEnabled: true,
    marketingEnabled: false,
    functionalEnabled: true,
    theme: 'light',
    customCSS: ''
  });

  const handleSaveCookieSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving cookie settings:', cookieSettings);
      
      toast.success('Paramètres de cookies sauvegardés', {
        description: 'La bannière sera visible sur votre site web public'
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setCookieSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Cookie className="h-6 w-6" />
          Gestion des Cookies
        </h2>
        <Button 
          onClick={handleSaveCookieSettings} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      
      <p className="text-gray-600">
        Configurez la bannière de cookies et les préférences de consentement pour votre site web public
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration générale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration générale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="cookies-enabled">Activer la gestion des cookies</Label>
              <Switch
                id="cookies-enabled"
                checked={cookieSettings.enabled}
                onCheckedChange={(value) => updateSetting('enabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-banner">Afficher la bannière</Label>
              <Switch
                id="show-banner"
                checked={cookieSettings.showBanner}
                onCheckedChange={(value) => updateSetting('showBanner', value)}
                disabled={!cookieSettings.enabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Position de la bannière</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={cookieSettings.bannerPosition}
                onChange={(e) => updateSetting('bannerPosition', e.target.value)}
                disabled={!cookieSettings.enabled || !cookieSettings.showBanner}
              >
                <option value="bottom">En bas</option>
                <option value="top">En haut</option>
                <option value="center">Centre (modal)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Thème</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={cookieSettings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                disabled={!cookieSettings.enabled}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Types de cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Types de cookies autorisés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Cookies fonctionnels</Label>
                <p className="text-xs text-gray-500">Nécessaires au fonctionnement du site</p>
              </div>
              <Switch
                checked={cookieSettings.functionalEnabled}
                onCheckedChange={(value) => updateSetting('functionalEnabled', value)}
                disabled={!cookieSettings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Cookies analytiques</Label>
                <p className="text-xs text-gray-500">Statistiques d'utilisation anonymes</p>
              </div>
              <Switch
                checked={cookieSettings.analyticsEnabled}
                onCheckedChange={(value) => updateSetting('analyticsEnabled', value)}
                disabled={!cookieSettings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Cookies marketing</Label>
                <p className="text-xs text-gray-500">Publicité personnalisée</p>
              </div>
              <Switch
                checked={cookieSettings.marketingEnabled}
                onCheckedChange={(value) => updateSetting('marketingEnabled', value)}
                disabled={!cookieSettings.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Textes de la bannière */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personnalisation des textes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Message principal</Label>
              <Textarea
                placeholder="Texte affiché dans la bannière de cookies..."
                value={cookieSettings.bannerText}
                onChange={(e) => updateSetting('bannerText', e.target.value)}
                rows={3}
                disabled={!cookieSettings.enabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texte bouton "Accepter"</Label>
                <Input
                  value={cookieSettings.acceptButtonText}
                  onChange={(e) => updateSetting('acceptButtonText', e.target.value)}
                  disabled={!cookieSettings.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Texte bouton "Refuser"</Label>
                <Input
                  value={cookieSettings.declineButtonText}
                  onChange={(e) => updateSetting('declineButtonText', e.target.value)}
                  disabled={!cookieSettings.enabled}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texte lien politique</Label>
                <Input
                  value={cookieSettings.policyLinkText}
                  onChange={(e) => updateSetting('policyLinkText', e.target.value)}
                  disabled={!cookieSettings.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label>URL politique de cookies</Label>
                <Input
                  value={cookieSettings.policyUrl}
                  onChange={(e) => updateSetting('policyUrl', e.target.value)}
                  placeholder="/politique-cookies"
                  disabled={!cookieSettings.enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSS personnalisé */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              CSS personnalisé (optionnel)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Styles CSS personnalisés pour la bannière</Label>
              <Textarea
                placeholder="/* CSS personnalisé pour styliser la bannière de cookies */
.cookie-banner {
  /* Vos styles ici */
}"
                value={cookieSettings.customCSS}
                onChange={(e) => updateSetting('customCSS', e.target.value)}
                rows={6}
                className="font-mono text-sm"
                disabled={!cookieSettings.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu de la bannière
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cookieSettings.enabled && cookieSettings.showBanner ? (
              <div className={`p-4 border rounded-lg ${
                cookieSettings.theme === 'dark' 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-200'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm">{cookieSettings.bannerText}</p>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      {cookieSettings.policyLinkText}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {cookieSettings.declineButtonText}
                    </Button>
                    <Button size="sm">
                      {cookieSettings.acceptButtonText}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Cookie className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>La bannière est désactivée</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiesTab;
