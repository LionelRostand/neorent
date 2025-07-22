
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
            <SelectItem value="Appartement">{t('properties.propertyTypes.apartment')}</SelectItem>
            <SelectItem value="Maison">{t('properties.propertyTypes.house')}</SelectItem>
            <SelectItem value="Studio">{t('properties.propertyTypes.studio')}</SelectItem>
            <SelectItem value="Chambre">{t('properties.propertyTypes.room')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicPropertyFields;
