
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const LocationFields = ({ formData, onInputChange }: LocationFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="address">{t('properties.address')} *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onInputChange('address', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="surface">{t('properties.surface')}</Label>
        <Input
          id="surface"
          value={formData.surface}
          onChange={(e) => onInputChange('surface', e.target.value)}
          placeholder="ex: 45 m²"
        />
      </div>
    </>
  );
};

export default LocationFields;
