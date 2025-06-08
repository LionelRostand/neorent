
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import PropertyMetrics from '@/components/PropertyMetrics';
import PropertyList from '@/components/PropertyList';

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
      image: '/placeholder.svg',
      locationType: 'Location',
      totalRooms: null,
      availableRooms: null
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
      image: '/placeholder.svg',
      locationType: 'Location',
      totalRooms: null,
      availableRooms: null
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
      image: '/placeholder.svg',
      locationType: 'Colocation',
      totalRooms: 4,
      availableRooms: 1
    }
  ]);

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
      image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : '/placeholder.svg',
      locationType: data.locationType,
      totalRooms: data.locationType === 'Colocation' ? data.totalRooms : null,
      availableRooms: data.locationType === 'Colocation' ? data.totalRooms : null
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

        <PropertyMetrics properties={properties} />
        <PropertyList properties={properties} />
      </div>
    </MainLayout>
  );
};

export default Properties;
