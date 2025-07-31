
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Propriétés</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="Appartement">{t('propertyForm.propertyTypes.appartement')}</SelectItem>
              <SelectItem value="Maison">{t('propertyForm.propertyTypes.maison')}</SelectItem>
              <SelectItem value="Studio">{t('propertyForm.propertyTypes.studio')}</SelectItem>
              <SelectItem value="Chambre">{t('propertyForm.propertyTypes.chambre')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicPropertyFields;
