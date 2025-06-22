
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RoommateDetailsFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const RoommateDetailsFields = ({ formData, onInputChange }: RoommateDetailsFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="rentAmount">{t('tenantForm.rentAmount')}</Label>
        <Input
          id="rentAmount"
          type="number"
          value={formData.rentAmount}
          onChange={(e) => onInputChange('rentAmount', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="moveInDate">{t('roommates.moveInDate')}</Label>
        <Input
          id="moveInDate"
          type="date"
          value={formData.moveInDate}
          onChange={(e) => onInputChange('moveInDate', e.target.value)}
        />
      </div>
    </>
  );
};

export default RoommateDetailsFields;
