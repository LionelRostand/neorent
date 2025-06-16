
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const MapTab = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [mapConfig, setMapConfig] = useState({
    enabled: true,
    address: '123 Rue de la Paix, 75001 Paris',
    latitude: '48.8566',
    longitude: '2.3522',
    zoom: '15',
    showMarker: true,
    markerTitle: 'NeoRent - Gestion Immobilière',
    apiKey: ''
  });

  const handleSaveMap = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sauvegarde configuration carte:', mapConfig);
      
      toast.success('Configuration de la carte sauvegardée !', {
        description: 'Paramètres de géolocalisation mis à jour'
      });
    } catch (error) {
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
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🗺️ Configuration de la carte</h2>
        <Button 
          onClick={handleSaveMap} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Configurez l'affichage de la carte et la géolocalisation de NeoRent.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Paramètres de la carte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Afficher la carte</Label>
              <p className="text-xs text-gray-600">Activer/désactiver l'affichage de la carte</p>
            </div>
            <Switch
              checked={mapConfig.enabled}
              onCheckedChange={(checked) => setMapConfig({...mapConfig, enabled: checked})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={mapConfig.address}
                onChange={(e) => setMapConfig({...mapConfig, address: e.target.value})}
                placeholder="Adresse complète"
              />
            </div>
            <div className="space-y-2">
              <Label>Titre du marqueur</Label>
              <Input
                value={mapConfig.markerTitle}
                onChange={(e) => setMapConfig({...mapConfig, markerTitle: e.target.value})}
                placeholder="Nom affiché sur le marqueur"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                value={mapConfig.latitude}
                onChange={(e) => setMapConfig({...mapConfig, latitude: e.target.value})}
                placeholder="48.8566"
              />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                value={mapConfig.longitude}
                onChange={(e) => setMapConfig({...mapConfig, longitude: e.target.value})}
                placeholder="2.3522"
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau de zoom</Label>
              <Input
                value={mapConfig.zoom}
                onChange={(e) => setMapConfig({...mapConfig, zoom: e.target.value})}
                placeholder="15"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Afficher le marqueur</Label>
              <p className="text-xs text-gray-600">Marquer la position sur la carte</p>
            </div>
            <Switch
              checked={mapConfig.showMarker}
              onCheckedChange={(checked) => setMapConfig({...mapConfig, showMarker: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label>Clé API Google Maps (optionnel)</Label>
            <Input
              type="password"
              value={mapConfig.apiKey}
              onChange={(e) => setMapConfig({...mapConfig, apiKey: e.target.value})}
              placeholder="Votre clé API Google Maps"
            />
            <p className="text-xs text-gray-500">
              Laissez vide pour utiliser la carte par défaut
            </p>
          </div>
        </CardContent>
      </Card>

      {mapConfig.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Aperçu de la carte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Aperçu de la carte</p>
                <p className="text-sm">{mapConfig.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapTab;
