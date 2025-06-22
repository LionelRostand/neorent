
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  totalRooms: number;
  availableRooms: number;
}

interface PropertyRoomFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  properties?: Property[];
}

const PropertyRoomFields = ({ formData, onInputChange, properties = [] }: PropertyRoomFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="property">{t('tenantForm.property')}</Label>
        {properties.length > 0 ? (
          <Select value={formData.property} onValueChange={(value) => onInputChange('property', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une propriété" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="property"
            value={formData.property}
            onChange={(e) => onInputChange('property', e.target.value)}
            placeholder="Nom de la propriété"
          />
        )}
      </div>
      
      <div>
        <Label htmlFor="roomNumber">{t('roommates.roomNumber')}</Label>
        <Input
          id="roomNumber"
          value={formData.roomNumber}
          onChange={(e) => onInputChange('roomNumber', e.target.value)}
        />
      </div>
    </>
  );
};

export default PropertyRoomFields;
