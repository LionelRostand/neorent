
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

  // Utiliser les propriétés du propriétaire connecté et filtrer pour les colocations
  const availableProperties = (properties || ownerProperties)?.filter(property => 
    property.locationType === 'Colocation'
  ) || [];

  // Trouver la propriété sélectionnée pour récupérer le nombre de chambres
  const selectedProperty = availableProperties.find(property => property.title === formData.property);
  
  // Générer la liste des chambres disponibles basée sur totalRooms
  const generateRoomNumbers = (totalRooms: number) => {
    const rooms = [];
    for (let i = 1; i <= totalRooms; i++) {
      rooms.push(`Chambre ${i}`);
    }
    return rooms;
  };

  const availableRooms = selectedProperty ? generateRoomNumbers(selectedProperty.totalRooms) : [];

  return (
    <>
      <div>
        <Label htmlFor="property">{t('roommateForm.property')}</Label>
        <Select value={formData.property} onValueChange={(value) => {
          onInputChange('property', value);
          // Reset room number when property changes
          onInputChange('roomNumber', '');
        }}>
          <SelectTrigger>
            <SelectValue placeholder={t('roommateForm.selectProperty')} />
          </SelectTrigger>
          <SelectContent>
            {availableProperties && availableProperties.length > 0 ? (
              availableProperties.map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address} ({property.totalRooms} chambres)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-properties" disabled>
                Aucune propriété de colocation disponible
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="roomNumber">{t('roommateForm.roomNumber')}</Label>
        <Select 
          value={formData.roomNumber} 
          onValueChange={(value) => onInputChange('roomNumber', value)}
          disabled={!formData.property || availableRooms.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={formData.property ? "Sélectionnez une chambre" : "Sélectionnez d'abord une propriété"} />
          </SelectTrigger>
          <SelectContent>
            {availableRooms.length > 0 ? (
              availableRooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-rooms" disabled>
                Aucune chambre disponible
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PropertyRoomFields;
