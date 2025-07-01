
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  isBailContract: boolean;
  getAvailableProperties: () => any[];
  getAvailableRooms: () => string[];
  isColocatifContract: boolean;
  isDataLoading: boolean;
}

const PropertyFields = ({ 
  formData, 
  handleInputChange, 
  isBailContract, 
  getAvailableProperties,
  getAvailableRooms,
  isColocatifContract,
  isDataLoading
}: PropertyFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {isBailContract && (
        <div>
          <Label htmlFor="property">{t('contractForm.property')}</Label>
          <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isDataLoading ? t('common.loading') : t('contractForm.selectAProperty')} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableProperties().map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isBailContract && (
        <div>
          <Label htmlFor="property">{t('contractForm.property')}</Label>
          <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isDataLoading ? t('common.loading') : t('contractForm.selectAProperty')} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableProperties().map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isColocatifContract && formData.property && (
        <div>
          <Label htmlFor="roomNumber">{t('common.room')}</Label>
          <Select value={formData.roomNumber} onValueChange={(value) => handleInputChange('roomNumber', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('common.selectRoom')} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableRooms().map((room) => (
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

export default PropertyFields;
