
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyRoomFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const PropertyRoomFields = ({ formData, onInputChange }: PropertyRoomFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="property">{t('tenantForm.property')}</Label>
        <Input
          id="property"
          value={formData.property}
          onChange={(e) => onInputChange('property', e.target.value)}
        />
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
