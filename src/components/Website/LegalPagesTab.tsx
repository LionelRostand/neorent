
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  FileText, 
  Shield, 
  Cookie,
  Eye,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const LegalPagesTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  
  // États pour chaque page légale
  const [legalNotice, setLegalNotice] = useState({
    title: 'Mentions Légales',
    content: `**MENTIONS LÉGALES**

**Éditeur du site :**
Neo Rent
Société par actions simplifiée au capital de 10 000 €
RCS Paris : 123 456 789
Siège social : 123 Rue de l'Immobilier, 75001 Paris

**Directeur de la publication :**
[Nom du directeur]

**Hébergement :**
OVH SAS
2 rue Kellermann - 59100 Roubaix - France

**Contact :**
Email : contact@neorent.fr
Téléphone : +33 1 23 45 67 89`
  });

  const [privacyPolicy, setPrivacyPolicy] = useState({
    title: 'Politique de Confidentialité',
    content: `**POLITIQUE DE CONFIDENTIALITÉ**

**1. Collecte des données**
Nous collectons les données personnelles que vous nous fournissez lors de :
- Votre inscription sur notre plateforme
- Vos demandes de renseignements
- L'utilisation de nos services

**2. Utilisation des données**
Vos données sont utilisées pour :
- Gérer votre compte utilisateur
- Vous contacter concernant nos services
- Améliorer nos prestations

**3. Conservation des données**
Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées.

**4. Vos droits**
Conformément au RGPD, vous disposez des droits suivants :
- Droit d'accès à vos données
- Droit de rectification
- Droit à l'effacement
- Droit d'opposition

**Contact :**
Email : privacy@neorent.fr`
  });

  const [cookiePolicy, setCookiePolicy] = useState({
    title: 'Politique de Cookies',
    content: `**POLITIQUE DE COOKIES**

**Qu'est-ce qu'un cookie ?**
Un cookie est un petit fichier texte stocké sur votre ordinateur lors de la visite d'un site web.

**Types de cookies utilisés :**

**1. Cookies nécessaires**
Ces cookies sont indispensables au fonctionnement du site.

**2. Cookies analytiques**
Ils nous permettent d'analyser l'utilisation du site pour l'améliorer.

**3. Cookies de préférences**
Ils mémorisent vos choix et préférences.

**Gestion des cookies :**
Vous pouvez gérer vos préférences de cookies via le bandeau qui s'affiche lors de votre première visite.

**Contact :**
Email : cookies@neorent.fr`
  });

  const handleSave = async (pageType: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Sauvegarde de la page ${pageType}`);
      toast.success(`Page ${pageType} sauvegardée avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const previewPage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      {/* En-tête responsive */}
      <div className="text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Pages Légales</h2>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Gérez le contenu de vos pages légales obligatoires
        </p>
      </div>

      <Tabs defaultValue="legal-notice" className="space-y-4 md:space-y-6">
        {/* Tabs responsive avec scroll horizontal sur mobile */}
        <div className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger 
              value="legal-notice" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Mentions Légales</span>
            </TabsTrigger>
            <TabsTrigger 
              value="privacy-policy" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Confidentialité</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cookie-policy" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
            >
              <Cookie className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Cookies</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mentions Légales */}
        <TabsContent value="legal-notice">
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <FileText className="h-4 w-4 md:h-5 md:w-5" />
                  Mentions Légales
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => previewPage('/legal-notice')}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Aperçu
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/legal-notice', '_blank')}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Page live
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="legal-title" className="text-sm font-medium">Titre de la page</Label>
                <Input
                  id="legal-title"
                  value={legalNotice.title}
                  onChange={(e) => setLegalNotice(prev => ({...prev, title: e.target.value}))}
                  className="mt-1 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="legal-content" className="text-sm font-medium">Contenu (Markdown supporté)</Label>
                <Textarea
                  id="legal-content"
                  rows={8}
                  value={legalNotice.content}
                  onChange={(e) => setLegalNotice(prev => ({...prev, content: e.target.value}))}
                  className="mt-1 font-mono text-xs sm:text-sm"
                  placeholder="Saisissez le contenu des mentions légales..."
                />
              </div>
              
              <Button 
                onClick={() => handleSave('mentions légales')} 
                disabled={isSaving}
                className="w-full text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les mentions légales'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Politique de Confidentialité */}
        <TabsContent value="privacy-policy">
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Shield className="h-4 w-4 md:h-5 md:w-5" />
                  Politique de Confidentialité
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => previewPage('/privacy-policy')}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Aperçu
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/privacy-policy', '_blank')}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Page live
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="privacy-title" className="text-sm font-medium">Titre de la page</Label>
                <Input
                  id="privacy-title"
                  value={privacyPolicy.title}
                  onChange={(e) => setPrivacyPolicy(prev => ({...prev, title: e.target.value}))}
                  className="mt-1 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="privacy-content" className="text-sm font-medium">Contenu (Markdown supporté)</Label>
                <Textarea
                  id="privacy-content"
                  rows={8}
                  value={privacyPolicy.content}
                  onChange={(e) => setPrivacyPolicy(prev => ({...prev, content: e.target.value}))}
                  className="mt-1 font-mono text-xs sm:text-sm"
                  placeholder="Saisissez le contenu de la politique de confidentialité..."
                />
              </div>
              
              <Button 
                onClick={() => handleSave('politique de confidentialité')} 
                disabled={isSaving}
                className="w-full text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder la politique de confidentialité'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Politique de Cookies */}
        <TabsContent value="cookie-policy">
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Cookie className="h-4 w-4 md:h-5 md:w-5" />
                  Politique de Cookies
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => previewPage('/cookie-policy')}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Aperçu
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/cookie-policy', '_blank')}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Page live
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="cookie-title" className="text-sm font-medium">Titre de la page</Label>
                <Input
                  id="cookie-title"
                  value={cookiePolicy.title}
                  onChange={(e) => setCookiePolicy(prev => ({...prev, title: e.target.value}))}
                  className="mt-1 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="cookie-content" className="text-sm font-medium">Contenu (Markdown supporté)</Label>
                <Textarea
                  id="cookie-content"
                  rows={8}
                  value={cookiePolicy.content}
                  onChange={(e) => setCookiePolicy(prev => ({...prev, content: e.target.value}))}
                  className="mt-1 font-mono text-xs sm:text-sm"
                  placeholder="Saisissez le contenu de la politique de cookies..."
                />
              </div>
              
              <Button 
                onClick={() => handleSave('politique de cookies')} 
                disabled={isSaving}
                className="w-full text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder la politique de cookies'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations importantes - responsive */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 md:pt-6">
          <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">
            Informations importantes
          </h3>
          <ul className="space-y-1 text-xs md:text-sm text-blue-800">
            <li>• Les mentions légales sont obligatoires pour tout site web professionnel</li>
            <li>• La politique de confidentialité est requise par le RGPD</li>
            <li>• La politique de cookies doit être facilement accessible</li>
            <li>• Ces pages doivent être mises à jour régulièrement</li>
            <li>• Le format Markdown permet une mise en forme avancée</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalPagesTab;
