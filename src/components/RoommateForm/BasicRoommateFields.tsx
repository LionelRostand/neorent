
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicRoommateFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const BasicRoommateFields = ({ formData, onInputChange }: BasicRoommateFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="name">{t('profile.name')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">{t('profile.email')} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default BasicRoommateFields;
