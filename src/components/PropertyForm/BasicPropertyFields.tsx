
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicPropertyFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const BasicPropertyFields = ({ formData, onInputChange }: BasicPropertyFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="title">{t('properties.title')} *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="type">{t('properties.type')} *</Label>
        <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('properties.selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Appartement">Appartement</SelectItem>
            <SelectItem value="Maison">Maison</SelectItem>
            <SelectItem value="Studio">Studio</SelectItem>
            <SelectItem value="Chambre">Chambre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicPropertyFields;
