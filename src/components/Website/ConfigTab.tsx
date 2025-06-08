
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

const ConfigTab = () => {
  const [seoSettings, setSeoSettings] = useState({
    title: 'NeoGarage Auto - Garage de confiance à Paris',
    description: 'Entretien et réparation automobile professionnel à Paris',
    keywords: 'garage, automobile, réparation, entretien, Paris'
  });

  const [features, setFeatures] = useState({
    onlineBooking: true,
    onlineQuote: true,
    liveChat: true
  });

  const handleSaveSEO = () => {
    console.log('Sauvegarde des paramètres SEO:', seoSettings);
    // Ici on sauvegarderait les paramètres SEO
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">⚙️ Configuration générale</h2>
        <Button onClick={handleSaveSEO} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
      </div>
      <p className="text-gray-600">Paramètres techniques SEO, fonctionnalités et connexion backend Firebase.</p>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Titre du site</Label>
            <Input
              value={seoSettings.title}
              onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={seoSettings.description}
              onChange={(e) => setSeoSettings({...seoSettings, description: e.target.value})}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Mots-clés</Label>
            <Input
              value={seoSettings.keywords}
              onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>✅ Prise de rendez-vous en ligne</Label>
              <p className="text-sm text-gray-600">Permettre aux clients de prendre RDV</p>
            </div>
            <Switch
              checked={features.onlineBooking}
              onCheckedChange={(checked) => setFeatures({...features, onlineBooking: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>✅ Devis en ligne</Label>
              <p className="text-sm text-gray-600">Formulaire de demande de devis</p>
            </div>
            <Switch
              checked={features.onlineQuote}
              onCheckedChange={(checked) => setFeatures({...features, onlineQuote: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>✅ Chat en direct (ChatWidget)</Label>
              <p className="text-sm text-gray-600">Support client en temps réel</p>
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
          <CardTitle>Accès rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">Accès espace client</Button>
            <Button variant="outline">Connexion Firebase</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigTab;
