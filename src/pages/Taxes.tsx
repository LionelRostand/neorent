
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Building, ChevronDown, Home, Building2, Castle, FileText } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import TaxDeclarationForm from '@/components/TaxDeclarationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseFiscality } from '@/hooks/useFirebaseFiscality';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

const Taxes = () => {
  const { t } = useTranslation();
  const [isDeclarationDialogOpen, setIsDeclarationDialogOpen] = useState(false);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const { fiscalities, loading, error, addFiscality, updateFiscality, deleteFiscality } = useFirebaseFiscality();
  const { addProperty } = useFirebaseProperties();
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
    setIsPropertyDialogOpen(true);
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
      console.log('Bien ajouté depuis la page taxes:', newProperty);
      setIsPropertyDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bien depuis taxes:', err);
      toast({
        title: t('common.error'),
        description: t('properties.addError'),
        variant: "destructive",
      });
    }
  };

  const handleAddDeclaration = async (data: any) => {
    try {
      await addFiscality(data);
      toast({
        title: t('common.success'),
        description: t('taxes.addSuccess'),
      });
      setIsDeclarationDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la déclaration fiscale:', err);
      toast({
        title: t('common.error'),
        description: t('taxes.addError'),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('taxes.loading')}</div>
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

  const currentYear = new Date().getFullYear();
  const totalDeclarations = fiscalities?.length || 0;
  const paidDeclarations = fiscalities?.filter(d => d.status === 'Payée')?.length || 0;
  const pendingDeclarations = fiscalities?.filter(d => d.status === 'À déclarer')?.length || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('taxes.title')}</h1>
            <p className="text-gray-600 mt-2">{t('taxes.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            {/* Bouton pour ajouter un bien immobilier */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('taxes.addRealEstateProperty')}
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

            {/* Bouton pour nouvelle déclaration fiscale */}
            <Button 
              onClick={() => setIsDeclarationDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('taxes.newDeclaration')}
            </Button>
          </div>
        </div>

        {/* Métriques fiscales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('taxes.paidTaxes')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidDeclarations}</div>
              <p className="text-xs text-muted-foreground">{t('taxes.taxPaid')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('taxes.taxesToDeclare')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDeclarations}</div>
              <p className="text-xs text-muted-foreground">{t('taxes.declarationToDo')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('taxes.totalObligation')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeclarations}</div>
              <p className="text-xs text-muted-foreground">{t('taxes.totalObligation')}</p>
            </CardContent>
          </Card>
        </div>

        {/* État vide ou liste des déclarations */}
        {!fiscalities || fiscalities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
            <Building className="h-16 w-16 text-orange-400 mb-4" />
            <h2 className="text-xl font-semibold text-orange-800 mb-2">{t('taxes.addRealEstateProperty')}</h2>
            <p className="text-orange-600 mb-6">{t('taxes.noPropertySelected')}</p>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3">
                  <Plus className="mr-2 h-5 w-5" />
                  {t('taxes.addRealEstateProperty')}
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
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('taxes.declarationList')}</h2>
            <div className="grid gap-4">
              {fiscalities && fiscalities.map((fiscality) => (
                <Card key={fiscality.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{fiscality.year}</h3>
                        <p className="text-sm text-gray-600">{fiscality.property}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {fiscality.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          fiscality.status === 'Payée' ? 'bg-green-100 text-green-800' :
                          fiscality.status === 'À déclarer' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fiscality.status}
                        </span>
                        <p className="text-lg font-bold mt-2">
                          {fiscality.amount}€
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dialogs */}
        <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
          <PropertyForm
            onClose={() => setIsPropertyDialogOpen(false)}
            onSubmit={handleAddProperty}
            initialType={selectedPropertyType}
          />
        </Dialog>

        <TaxDeclarationForm
          isOpen={isDeclarationDialogOpen}
          onClose={() => setIsDeclarationDialogOpen(false)}
          onSubmit={handleAddDeclaration}
        />
      </div>
    </MainLayout>
  );
};

export default Taxes;
