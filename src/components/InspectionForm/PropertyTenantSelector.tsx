
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyTenantSelectorProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  properties: any[];
  availableTenants: Array<{id: string, name: string, type: string}>;
  availableRooms: string[];
}

const PropertyTenantSelector = ({ 
  formData, 
  onInputChange, 
  properties, 
  availableTenants, 
  availableRooms 
}: PropertyTenantSelectorProps) => {
  const { t } = useTranslation();
  const isColocatifContract = formData.contractType === 'Bail colocatif';

  return (
    <>
      <div>
        <Label htmlFor="property">{t('inspections.property')}</Label>
        <Select value={formData.property} onValueChange={(value) => onInputChange('property', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('inspections.selectProperty')} />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.title}>
                {property.title} - {property.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="contractType">{t('inspections.contractType')}</Label>
        <Select value={formData.contractType} onValueChange={(value) => onInputChange('contractType', value)} disabled>
          <SelectTrigger>
            <SelectValue placeholder={t('inspections.automaticByProperty')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bail locatif">{t('inspections.rentalLease')}</SelectItem>
            <SelectItem value="Bail colocatif">{t('inspections.colocationLease')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tenant">
          {formData.contractType === 'Bail locatif' ? t('inspections.tenant') : t('inspections.roommate')}
        </Label>
        <Select 
          value={formData.tenant} 
          onValueChange={(value) => onInputChange('tenant', value)}
          disabled={!formData.property}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !formData.property 
                ? t('inspections.selectPropertyFirst')
                : formData.contractType === 'Bail locatif' 
                  ? t('inspections.selectTenant')
                  : t('inspections.selectRoommate')
            } />
          </SelectTrigger>
          <SelectContent>
            {availableTenants.length > 0 ? (
              availableTenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.name}>
                  {tenant.name} ({tenant.type})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-tenants" disabled>
                {formData.property ? t('inspections.noTenantsForProperty') : t('inspections.selectPropertyFirst')}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {isColocatifContract && formData.property && (
        <div>
          <Label htmlFor="roomNumber">{t('inspections.room')}</Label>
          <Select value={formData.roomNumber} onValueChange={(value) => onInputChange('roomNumber', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('inspections.selectRoom')} />
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

export default PropertyTenantSelector;
