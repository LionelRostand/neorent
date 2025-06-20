
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import PropertyMetrics from '@/components/PropertyMetrics';
import PropertyList from '@/components/PropertyList';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';
import { useOwnerFilter } from '@/hooks/useOwnerFilter';
import { useAuth } from '@/hooks/useAuth';

const Properties = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useFirebaseProperties();
  const { toast } = useToast();
  const { currentOwner, isOwnerFiltered, filterByOwner } = useOwnerFilter();
  const { userType } = useAuth();

  // Filtrer les propriétés par propriétaire si nécessaire
  const filteredProperties = filterByOwner(properties);

  const handleAddProperty = async (data: any) => {
    try {
      const newProperty = {
        title: data.title,
        address: data.address,
        type: data.type,
        surface: data.surface,
        rent: data.creditImmobilier,
        creditImmobilier: data.creditImmobilier,
        owner: data.owner || currentOwner, // Utiliser le propriétaire actuel si pas spécifié
        charges: data.charges,
        floor: data.floor,
        status: 'Libre',
        tenant: null,
        image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : '/placeholder.svg',
        locationType: data.locationType,
        totalRooms: data.locationType === 'Colocation' ? parseInt(data.roomCount) || 0 : 0,
        availableRooms: data.locationType === 'Colocation' ? parseInt(data.roomCount) || 0 : 0
      };

      await addProperty(newProperty);
      toast({
        title: t('common.success'),
        description: t('properties.addSuccess'),
      });
      console.log('Bien ajouté à la collection Rent_properties:', newProperty);
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bien:', err);
      toast({
        title: t('common.error'),
        description: t('properties.addError'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateProperty = async (id: string, updates: any) => {
    try {
      await updateProperty(id, updates);
      toast({
        title: t('common.success'),
        description: t('properties.updateSuccess'),
      });
      console.log('Bien modifié dans la collection Rent_properties:', { id, updates });
    } catch (err) {
      console.error('Erreur lors de la modification du bien:', err);
      toast({
        title: t('common.error'),
        description: t('properties.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
      toast({
        title: t('common.success'),
        description: t('properties.deleteSuccess'),
      });
      console.log('Bien supprimé de la collection Rent_properties:', id);
    } catch (err) {
      console.error('Erreur lors de la suppression du bien:', err);
      toast({
        title: t('common.error'),
        description: t('properties.deleteError'),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('properties.loading')}</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{t('common.error')}: {error}</div>
        </div>
      </MainLayout>
    );
  }

  // Déterminer le titre et sous-titre basé sur le type d'utilisateur et le filtrage
  const getPageTitle = () => {
    if (userType === 'admin' && !isOwnerFiltered) {
      return t('properties.title'); // Titre normal pour admin
    }
    if (isOwnerFiltered && currentOwner) {
      return `${t('properties.title')} - ${currentOwner}`;
    }
    return t('properties.title');
  };

  const getPageSubtitle = () => {
    if (userType === 'admin' && !isOwnerFiltered) {
      return t('properties.subtitle'); // Sous-titre normal pour admin
    }
    if (isOwnerFiltered && currentOwner) {
      return `Propriétés de ${currentOwner}`;
    }
    return t('properties.subtitle');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 mt-2">
              {getPageSubtitle()}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                {t('properties.addProperty')}
              </Button>
            </DialogTrigger>
            <PropertyForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddProperty}
            />
          </Dialog>
        </div>

        <PropertyMetrics />
        <PropertyList 
          properties={filteredProperties} 
          onUpdateProperty={handleUpdateProperty}
          onDeleteProperty={handleDeleteProperty}
        />
      </div>
    </MainLayout>
  );
};

export default Properties;
