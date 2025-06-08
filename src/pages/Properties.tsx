
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Home, DollarSign, Users } from 'lucide-react';

const properties = [
  {
    id: 1,
    title: 'Appartement Rue des Fleurs',
    address: '123 Rue des Fleurs, 75001 Paris',
    type: 'Appartement',
    surface: '65m²',
    rent: '1,200€',
    status: 'Occupé',
    tenant: 'Marie Dubois',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'Studio Centre-ville',
    address: '45 Avenue de la République, 75011 Paris',
    type: 'Studio',
    surface: '30m²',
    rent: '800€',
    status: 'Libre',
    tenant: null,
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Villa Montparnasse',
    address: '78 Boulevard Montparnasse, 75014 Paris',
    type: 'Maison',
    surface: '120m²',
    rent: '2,500€',
    status: 'Occupé',
    tenant: 'Jean Martin',
    image: '/placeholder.svg'
  }
];

const Properties = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Biens Immobiliers</h1>
            <p className="text-gray-600 mt-2">Gérez votre portefeuille immobilier</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900">{property.title}</h3>
                    <Badge 
                      variant={property.status === 'Occupé' ? 'default' : 'secondary'}
                      className={property.status === 'Occupé' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {property.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="mr-1 h-4 w-4" />
                    {property.address}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type: {property.type}</span>
                    <span className="text-gray-600">Surface: {property.surface}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center text-blue-600 font-semibold">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {property.rent}/mois
                    </div>
                    {property.tenant && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="mr-1 h-4 w-4" />
                        {property.tenant}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Properties;
