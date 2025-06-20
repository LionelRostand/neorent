
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInspectionFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const BasicInspectionFields = ({ formData, onInputChange }: BasicInspectionFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="title">{t('inspections.inspectionTitle')}</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          required
          placeholder={t('inspections.inspectionTitlePlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="type">{t('inspections.inspectionType')}</Label>
        <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('inspections.selectInspectionType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entrée">{t('inspections.entryInspection')}</SelectItem>
            <SelectItem value="Sortie">{t('inspections.exitInspection')}</SelectItem>
            <SelectItem value="Intermédiaire">{t('inspections.intermediateInspection')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicInspectionFields;
