
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyDetailsFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const PropertyDetailsFields = ({ formData, onInputChange }: PropertyDetailsFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="rent">{t('properties.rent')}</Label>
        <Input
          id="rent"
          type="number"
          value={formData.rent}
          onChange={(e) => onInputChange('rent', e.target.value)}
          placeholder="€"
        />
      </div>
      
      <div>
        <Label htmlFor="totalRooms">{t('properties.totalRooms')}</Label>
        <Input
          id="totalRooms"
          type="number"
          value={formData.totalRooms}
          onChange={(e) => onInputChange('totalRooms', e.target.value)}
        />
      </div>
    </>
  );
};

export default PropertyDetailsFields;
