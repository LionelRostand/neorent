
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import PropertyMetrics from '@/components/PropertyMetrics';
import PropertyList from '@/components/PropertyList';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

const Properties = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useFirebaseProperties();
  const { toast } = useToast();

  const handleAddProperty = async (data: any) => {
    try {
      const newProperty = {
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

      await addProperty(newProperty);
      toast({
        title: "Succès",
        description: "Le bien a été ajouté avec succès.",
      });
      console.log('Bien ajouté à la collection Rent_properties:', newProperty);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bien:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du bien.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProperty = async (id: string, updates: any) => {
    try {
      await updateProperty(id, updates);
      toast({
        title: "Succès",
        description: "Le bien a été modifié avec succès.",
      });
      console.log('Bien modifié dans la collection Rent_properties:', { id, updates });
    } catch (err) {
      console.error('Erreur lors de la modification du bien:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du bien.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
      toast({
        title: "Succès",
        description: "Le bien a été supprimé avec succès.",
      });
      console.log('Bien supprimé de la collection Rent_properties:', id);
    } catch (err) {
      console.error('Erreur lors de la suppression du bien:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du bien.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des biens immobiliers...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

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
        <PropertyList 
          properties={properties} 
          onUpdateProperty={handleUpdateProperty}
          onDeleteProperty={handleDeleteProperty}
        />
      </div>
    </MainLayout>
  );
};

export default Properties;
