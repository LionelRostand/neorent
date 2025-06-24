
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';

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

const PropertyRoomFields = ({ formData, onInputChange, properties }: PropertyRoomFieldsProps) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const { properties: ownerProperties } = useOwnerData(userProfile);

  // Utiliser les propriétés du propriétaire connecté
  const availableProperties = properties || ownerProperties;

  return (
    <>
      <div>
        <Label htmlFor="property">{t('roommateForm.property')}</Label>
        <Select value={formData.property} onValueChange={(value) => onInputChange('property', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('roommateForm.selectProperty')} />
          </SelectTrigger>
          <SelectContent>
            {availableProperties && availableProperties.length > 0 ? (
              availableProperties.map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-properties" disabled>
                Aucune propriété disponible
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="roomNumber">{t('roommateForm.roomNumber')}</Label>
        <Input
          id="roomNumber"
          value={formData.roomNumber}
          onChange={(e) => onInputChange('roomNumber', e.target.value)}
          placeholder="ex. Chambre 1"
        />
      </div>
    </>
  );
};

export default PropertyRoomFields;
