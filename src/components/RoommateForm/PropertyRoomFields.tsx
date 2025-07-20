
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface PropertyRoomFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const PropertyRoomFields = ({ formData, onInputChange }: PropertyRoomFieldsProps) => {
  const { t } = useTranslation();
  const { properties, loading } = useFirebaseProperties();

  // Filtrer les propriétés de type "Colocation"
  const colivingProperties = properties?.filter(property => 
    property.locationType === 'Colocation'
  ) || [];

  // Trouver la propriété sélectionnée pour récupérer le nombre de chambres
  const selectedProperty = colivingProperties.find(property => property.title === formData.property);
  
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
        <Select 
          value={formData.property} 
          onValueChange={(value) => {
            onInputChange('property', value);
            // Reset room number when property changes
            onInputChange('roomNumber', '');
          }}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading ? t('common.loading') : t('roommateForm.selectProperty')} />
          </SelectTrigger>
          <SelectContent>
            {colivingProperties && colivingProperties.length > 0 ? (
              colivingProperties.map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address} ({property.totalRooms} chambres)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-properties" disabled>
                {loading ? t('common.loading') : 'Aucune propriété de colocation disponible'}
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
                {formData.property ? 'Aucune chambre disponible' : 'Sélectionnez une propriété'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PropertyRoomFields;
