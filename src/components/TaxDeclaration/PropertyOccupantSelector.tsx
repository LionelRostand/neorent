
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PropertyForm from '@/components/PropertyForm';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
}

interface Tenant {
  id: string;
  name: string;
  property: string;
  rentAmount: string;
}

interface Roommate {
  id: string;
  name: string;
  property: string;
  rentAmount: string;
}

interface PropertyOccupantSelectorProps {
  properties: Property[];
  tenants: Tenant[];
  roommates: Roommate[];
  selectedProperties: string[];
  onPropertyChange: (propertyId: string, checked: boolean) => void;
}

const PropertyOccupantSelector = ({ 
  properties, 
  tenants, 
  roommates, 
  selectedProperties, 
  onPropertyChange 
}: PropertyOccupantSelectorProps) => {
  const { t } = useTranslation();
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  const propertyTypes = [
    { value: 'Appartement', label: t('common.apartment', 'Appartement') },
    { value: 'Studio', label: t('common.studio', 'Studio') },
    { value: 'Maison', label: t('common.house', 'Maison') },
    { value: 'Loft', label: t('common.loft', 'Loft') },
    { value: 'Duplex', label: t('common.duplex', 'Duplex') },
  ];

  const handlePropertyTypeSelect = (type: string) => {
    setSelectedPropertyType(type);
    setIsPropertyFormOpen(true);
  };

  const handleAddProperty = async (data: any) => {
    // Cette fonction sera gérée par le parent
    console.log('Nouveau bien ajouté:', data);
    setIsPropertyFormOpen(false);
  };

  if (properties.length === 0) {
    return (
      <div className="space-y-4">
        <Label>{t('taxes.selectProperty')}</Label>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-16 w-16 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-orange-800 mb-2">{t('taxes.addRealEstateProperty')}</h3>
            <p className="text-orange-600 mb-6">{t('taxes.noPropertySelected')}</p>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="mr-2 h-5 w-5" />
                  {t('common.add')} {t('common.property')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white z-50">
                {propertyTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => handlePropertyTypeSelect(type.value)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                  >
                    <Building2 className="h-4 w-4" />
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isPropertyFormOpen} onOpenChange={setIsPropertyFormOpen}>
              <PropertyForm
                onClose={() => setIsPropertyFormOpen(false)}
                onSubmit={handleAddProperty}
                initialType={selectedPropertyType}
              />
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>{t('taxes.selectProperty')}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t('common.add')} {t('common.property')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white z-50">
            {propertyTypes.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => handlePropertyTypeSelect(type.value)}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
              >
                <Building2 className="h-4 w-4" />
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('common.properties')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {properties.map((property) => (
            <div key={property.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                id={`property-${property.id}`}
                checked={selectedProperties.includes(property.id)}
                onChange={(e) => onPropertyChange(property.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor={`property-${property.id}`} className="text-sm font-medium cursor-pointer">
                  {property.title}
                </label>
                <p className="text-xs text-gray-500">
                  {property.address} • {t('common.rent')}: {property.rent}€/{t('common.month')}
                </p>
                <p className="text-xs text-gray-400">
                  {t('common.type')}: {property.type} • {t('common.surface')}: {property.surface}m²
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isPropertyFormOpen} onOpenChange={setIsPropertyFormOpen}>
        <PropertyForm
          onClose={() => setIsPropertyFormOpen(false)}
          onSubmit={handleAddProperty}
          initialType={selectedPropertyType}
        />
      </Dialog>
    </div>
  );
};

export default PropertyOccupantSelector;
