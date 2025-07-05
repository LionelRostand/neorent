
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
        <Label htmlFor="title">{t('propertyForm.title')} *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder={t('propertyForm.placeholders.title')}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="type">{t('propertyForm.type')} *</Label>
        <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('properties.selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Appartement">{t('propertyForm.propertyTypes.appartement')}</SelectItem>
            <SelectItem value="Maison">{t('propertyForm.propertyTypes.maison')}</SelectItem>
            <SelectItem value="Studio">{t('propertyForm.propertyTypes.studio')}</SelectItem>
            <SelectItem value="Loft">{t('propertyForm.propertyTypes.loft')}</SelectItem>
            <SelectItem value="Duplex">{t('propertyForm.propertyTypes.duplex')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicPropertyFields;
