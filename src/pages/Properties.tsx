import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, Home, DollarSign, Users, Building2, CheckCircle, Clock, XCircle } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import PropertyForm from '@/components/PropertyForm';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [properties, setProperties] = useState([
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
  ]);

  const occupiedCount = properties.filter(p => p.status === 'Occupé').length;
  const availableCount = properties.filter(p => p.status === 'Libre').length;
  const totalCount = properties.length;

  const handleAddProperty = (data: any) => {
    // Simuler l'ajout à la collection rent_immo
    const newProperty = {
      id: properties.length + 1,
      title: data.title,
      address: data.address,
      type: data.type,
      surface: data.surface,
      rent: data.rent,
      status: 'Libre',
      tenant: null,
      image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : '/placeholder.svg'
    };

    setProperties(prev => [...prev, newProperty]);
    console.log('Bien ajouté à la collection rent_immo:', newProperty);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Biens Immobiliers</h1>
            <p className="text-gray-600 mt-2">Gérez votre portefeuille immobilier</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un bien
              </Button>
            </DialogTrigger>
            <PropertyForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddProperty}
            />
          </Dialog>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Biens occupés"
            value={occupiedCount}
            description={`${occupiedCount} bien${occupiedCount > 1 ? 's' : ''} occupé${occupiedCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="Biens libres"
            value={availableCount}
            description={`${availableCount} bien${availableCount > 1 ? 's' : ''} libre${availableCount > 1 ? 's' : ''}`}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="En maintenance"
            value={0}
            description="0 bien en maintenance"
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} bien${totalCount > 1 ? 's' : ''} au total`}
            icon={Building2}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Biens Immobiliers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                {property.image && property.image !== '/placeholder.svg' ? (
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home className="h-12 w-12 text-gray-400" />
                )}
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
