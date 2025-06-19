
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

interface PropertySelectorProps {
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
}

const PropertySelector = ({ selectedProperty, onPropertyChange }: PropertySelectorProps) => {
  const { t } = useTranslation();
  const { properties, loading } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  // Fonction pour obtenir les locataires/colocataires d'un bien
  const getTenantInfo = (property: any) => {
    if (!property) return t('rentalCharges.noTenant', 'Aucun locataire');
    
    if (property.locationType === 'Colocation') {
      // Pour une colocation, chercher les colocataires
      const propertyRoommates = roommates.filter(r => r.property === property.title);
      if (propertyRoommates.length > 0) {
        return `${t('rentalCharges.roommates', 'Colocataires')}: ${propertyRoommates.map(r => r.name).join(', ')}`;
      }
      return t('rentalCharges.noRoommates', 'Aucun colocataire');
    } else {
      // Pour un appartement/maison, utiliser le champ tenant
      return property.tenant ? `${t('rentalCharges.tenant')}: ${property.tenant}` : t('rentalCharges.noTenant', 'Aucun locataire');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label htmlFor="property">{t('rentalCharges.property')}</Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="property">{t('rentalCharges.property')}</Label>
      <Select value={selectedProperty} onValueChange={onPropertyChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('rentalCharges.selectProperty')} />
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{property.title} - {property.locationType}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedPropertyData && (
        <p className="text-sm text-gray-600">
          {getTenantInfo(selectedPropertyData)}
        </p>
      )}
    </div>
  );
};

export default PropertySelector;
