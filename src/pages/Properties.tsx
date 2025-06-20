import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Building, ChevronDown, Home, Building2, Castle } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import PropertyMetrics from '@/components/PropertyMetrics';
import PropertyList from '@/components/PropertyList';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

const Properties = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useFirebaseProperties();
  const { toast } = useToast();

  const propertyTypes = [
    { value: 'Appartement', label: t('propertyForm.propertyTypes.appartement'), icon: Building2 },
    { value: 'Studio', label: t('propertyForm.propertyTypes.studio'), icon: Home },
    { value: 'Maison', label: t('propertyForm.propertyTypes.maison'), icon: Castle },
    { value: 'Loft', label: t('propertyForm.propertyTypes.loft'), icon: Building },
    { value: 'Duplex', label: t('propertyForm.propertyTypes.duplex'), icon: Building2 },
  ];

  const handlePropertyTypeSelect = (type: string) => {
    setSelectedPropertyType(type);
    setIsDialogOpen(true);
  };

  const handleAddProperty = async (data: any) => {
    try {
      const newProperty = {
        title: data.title,
        address: data.address,
        type: data.type,
        surface: data.surface,
        rent: data.creditImmobilier,
        creditImmobilier: data.creditImmobilier,
        owner: data.owner,
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

  // Affichage spécial quand aucune propriété n'existe
  if (properties.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('properties.title')}</h1>
              <p className="text-gray-600 mt-2">{t('properties.subtitle')}</p>
            </div>
          </div>

          {/* État vide avec menu déroulant d'ajout centré */}
          <div className="flex flex-col items-center justify-center py-16 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
            <Building className="h-16 w-16 text-orange-400 mb-4" />
            <h2 className="text-xl font-semibold text-orange-800 mb-2">Add Real Estate Property</h2>
            <p className="text-orange-600 mb-6">No Property Selected</p>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3">
                  <Plus className="mr-2 h-5 w-5" />
                  {t('properties.addProperty')}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {propertyTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => handlePropertyTypeSelect(type.value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <PropertyForm
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddProperty}
                initialType={selectedPropertyType}
              />
            </Dialog>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('properties.title')}</h1>
            <p className="text-gray-600 mt-2">{t('properties.subtitle')}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                {t('properties.addProperty')}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {propertyTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => handlePropertyTypeSelect(type.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <PropertyForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddProperty}
              initialType={selectedPropertyType}
            />
          </Dialog>
        </div>

        <PropertyMetrics />
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
