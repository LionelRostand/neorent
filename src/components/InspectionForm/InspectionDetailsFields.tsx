
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface InspectionDetailsFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const InspectionDetailsFields = ({ formData, onInputChange }: InspectionDetailsFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="date">{t('inspections.date')}</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onInputChange('date', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="inspector">{t('inspections.inspectorField')}</Label>
        <Input
          id="inspector"
          value={formData.inspector}
          onChange={(e) => onInputChange('inspector', e.target.value)}
          required
          placeholder={t('inspections.inspectorPlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="description">{t('inspections.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('inspections.descriptionPlaceholder')}
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="observations">{t('inspections.observations')}</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => onInputChange('observations', e.target.value)}
          placeholder={t('inspections.observationsPlaceholder')}
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};

export default InspectionDetailsFields;
