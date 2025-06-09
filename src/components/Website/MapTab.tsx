
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MapTab = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🗺️ Configuration de la géolocalisation</h2>
      <p className="text-gray-600 text-sm md:text-base">
        Affichage de la carte avec emplacements multiples et coordonnées GPS personnalisables.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Emplacement principal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Adresse</Label>
              <Input 
                defaultValue="123 Rue de l'Automobile, 75000 Paris" 
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm">Latitude</Label>
                <Input placeholder="48.8566" className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Longitude</Label>
                <Input placeholder="2.3522" className="text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Paramètres de la carte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Niveau de zoom</Label>
              <Select defaultValue="15">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 - Vue large</SelectItem>
                  <SelectItem value="15">15 - Vue normale</SelectItem>
                  <SelectItem value="18">18 - Vue proche</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Hauteur de la carte</Label>
              <Select defaultValue="400">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">300px</SelectItem>
                  <SelectItem value="400">400px</SelectItem>
                  <SelectItem value="500">500px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapTab;
