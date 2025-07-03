
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
        <div className="space-y-4 md:space-y-6 px-2 sm:px-0">
          {/* Header section with translations - Mobile optimized */}
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight break-words">{t('properties.title')}</h1>
                <p className="text-slate-100 mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed">
                  {t('properties.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* État vide avec menu déroulant d'ajout centré - Mobile optimized */}
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200 mx-2 sm:mx-0">
            <Building className="h-12 w-12 sm:h-16 sm:w-16 text-orange-400 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-orange-800 mb-2 text-center px-4">
              {t('properties.addProperty')}
            </h2>
            <p className="text-orange-600 mb-6 text-center px-4 text-sm sm:text-base">
              {t('properties.noPropertiesDesc')}
            </p>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-auto max-w-xs">
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{t('properties.addProperty')}</span>
                  <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50 bg-white border border-gray-200 shadow-lg">
                {propertyTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => handlePropertyTypeSelect(type.value)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2"
                  >
                    <type.icon className="h-4 w-4" />
                    <span className="text-sm">{type.label}</span>
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
      <div className="space-y-4 md:space-y-6 px-2 sm:px-0">
        {/* Header section with translations - Mobile optimized */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight break-words">{t('properties.title')}</h1>
              <p className="text-slate-100 mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed">
                {t('properties.subtitle')}
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6">
                    <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{t('properties.addProperty')}</span>
                    <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-50 bg-white border border-gray-200 shadow-lg">
                  {propertyTypes.map((type) => (
                    <DropdownMenuItem
                      key={type.value}
                      onClick={() => handlePropertyTypeSelect(type.value)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2"
                    >
                      <type.icon className="h-4 w-4" />
                      <span className="text-sm">{type.label}</span>
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
