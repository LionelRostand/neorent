
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

const ContentTab = () => {
  const [garageInfo, setGarageInfo] = useState({
    name: 'NeoGarage Auto',
    description: 'Votre garage de confiance pour l\'entretien et la réparation automobile',
    address: '123 Rue de l\'Automobile, 75000 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@neogarage.fr'
  });

  const handleSaveGarageInfo = () => {
    console.log('Sauvegarde des informations du garage:', garageInfo);
    // Ici on sauvegarderait dans Firebase
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">📝 Gestion du contenu</h2>
        <Button onClick={handleSaveGarageInfo} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
      </div>
      <p className="text-gray-600">Gestion des informations principales du garage avec sauvegarde centralisée.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informations du garage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="garage-name">Nom du garage</Label>
              <Input
                id="garage-name"
                value={garageInfo.name}
                onChange={(e) => setGarageInfo({...garageInfo, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garage-email">Email</Label>
              <Input
                id="garage-email"
                type="email"
                value={garageInfo.email}
                onChange={(e) => setGarageInfo({...garageInfo, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="garage-description">Description</Label>
            <Textarea
              id="garage-description"
              value={garageInfo.description}
              onChange={(e) => setGarageInfo({...garageInfo, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="garage-address">Adresse</Label>
              <Input
                id="garage-address"
                value={garageInfo.address}
                onChange={(e) => setGarageInfo({...garageInfo, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garage-phone">Téléphone</Label>
              <Input
                id="garage-phone"
                value={garageInfo.phone}
                onChange={(e) => setGarageInfo({...garageInfo, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horaires d'ouverture</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <Label className="w-20">{day}</Label>
                  <Input placeholder="08:00" className="w-20" />
                  <span>-</span>
                  <Input placeholder="18:00" className="w-20" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
