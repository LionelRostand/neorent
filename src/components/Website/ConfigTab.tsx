import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const ConfigTab = () => {
  const [seoSettings, setSeoSettings] = useState({
    title: 'NeoRent - Gestion Immobilière Simplifiée',
    description: 'NeoRent révolutionne la gestion de vos biens immobiliers avec une plateforme complète, intuitive et performante.',
    keywords: 'biens immobiliers, locations, colocations'
  });

  const [features, setFeatures] = useState({
    onlineBooking: true,
    onlineQuote: true,
    liveChat: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSEO = async () => {
    setIsSaving(true);
    try {
      // Simulation de la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sauvegarde des paramètres de configuration:', {
        seoSettings,
        features
      });
      
      toast.success('Configuration sauvegardée avec succès !', {
        description: 'Paramètres SEO et fonctionnalités mis à jour'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">⚙️ Configuration générale</h2>
        <Button 
          onClick={handleSaveSEO} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Paramètres techniques SEO, fonctionnalités et connexion backend Firebase.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Paramètres SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Titre du site</Label>
            <Input
              value={seoSettings.title}
              onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Description</Label>
            <Textarea
              value={seoSettings.description}
              onChange={(e) => setSeoSettings({...seoSettings, description: e.target.value})}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Mots-clés</Label>
            <Input
              value={seoSettings.keywords}
              onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">✅ Prise de rendez-vous en ligne</Label>
              <p className="text-xs md:text-sm text-gray-600">Permettre aux clients de prendre RDV</p>
            </div>
            <Switch
              checked={features.onlineBooking}
              onCheckedChange={(checked) => setFeatures({...features, onlineBooking: checked})}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">✅ Devis en ligne</Label>
              <p className="text-xs md:text-sm text-gray-600">Formulaire de demande de devis</p>
            </div>
            <Switch
              checked={features.onlineQuote}
              onCheckedChange={(checked) => setFeatures({...features, onlineQuote: checked})}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">✅ Chat en direct (ChatWidget)</Label>
              <p className="text-xs md:text-sm text-gray-600">Support client en temps réel</p>
            </div>
            <Switch
              checked={features.liveChat}
              onCheckedChange={(checked) => setFeatures({...features, liveChat: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Accès rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              Accès espace client
            </Button>
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              Connexion Firebase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigTab;
