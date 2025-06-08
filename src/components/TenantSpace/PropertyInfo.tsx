
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Home, Ruler, Euro, Users, MapPin } from 'lucide-react';

const PropertyInfo = () => {
  const propertyData = {
    title: 'Appartement Rue des Fleurs',
    address: '123 Rue des Fleurs, 75001 Paris',
    type: 'Appartement',
    surface: '65m²',
    rent: '1,200€',
    charges: '150€',
    deposit: '2,400€',
    rooms: 3,
    locationType: 'Location',
    landlord: 'SCI Immobilier Plus',
    description: 'Bel appartement 3 pièces situé dans le 1er arrondissement de Paris, proche des transports en commun.',
    amenities: ['Balcon', 'Cave', 'Ascenseur', 'Chauffage central', 'Parking']
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Caractéristiques du Logement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{propertyData.title}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {propertyData.address}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{propertyData.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Surface</p>
                    <p className="font-medium">{propertyData.surface}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pièces</p>
                    <p className="font-medium">{propertyData.rooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{propertyData.locationType}</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Informations Financières</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Loyer mensuel</span>
                  <span className="font-semibold text-green-600">{propertyData.rent}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Charges</span>
                  <span className="font-medium">{propertyData.charges}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Dépôt de garantie</span>
                  <span className="font-medium">{propertyData.deposit}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Description</h4>
            <p className="text-gray-700">{propertyData.description}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Équipements et Services</h4>
            <div className="flex flex-wrap gap-2">
              {propertyData.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Propriétaire :</strong> {propertyData.landlord}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyInfo;
