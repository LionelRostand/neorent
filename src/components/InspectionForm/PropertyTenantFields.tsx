
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InspectionFormData, Tenant } from '@/types/inspection';

interface PropertyTenantFieldsProps {
  formData: InspectionFormData;
  onInputChange: (field: keyof InspectionFormData, value: string) => void;
  availableProperties: string[];
  availableTenants: Tenant[];
  availableRooms: string[];
}

const PropertyTenantFields = ({ 
  formData, 
  onInputChange, 
  availableProperties, 
  availableTenants, 
  availableRooms 
}: PropertyTenantFieldsProps) => {
  const isColocatifContract = formData.contractType === 'Bail colocatif';

  return (
    <>
      {formData.contractType && (
        <div>
          <Label htmlFor="property">Bien immobilier *</Label>
          <Select value={formData.property} onValueChange={(value) => onInputChange('property', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un bien" />
            </SelectTrigger>
            <SelectContent>
              {availableProperties.map((property) => (
                <SelectItem key={property} value={property}>
                  {property}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {formData.contractType && (
        <div>
          <Label htmlFor="tenant">
            {formData.contractType === 'Bail locatif' ? 'Locataire *' : 'Colocataire *'}
          </Label>
          <Select value={formData.tenant} onValueChange={(value) => onInputChange('tenant', value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Sélectionner un ${formData.contractType === 'Bail locatif' ? 'locataire' : 'colocataire'}`} />
            </SelectTrigger>
            <SelectContent>
              {availableTenants.map((tenant) => (
                <SelectItem key={tenant.id} value={`${tenant.name} (${tenant.type})`}>
                  {tenant.name} ({tenant.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isColocatifContract && formData.property && (
        <div>
          <Label htmlFor="roomNumber">Chambre</Label>
          <Select value={formData.roomNumber} onValueChange={(value) => onInputChange('roomNumber', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une chambre" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default PropertyTenantFields;
