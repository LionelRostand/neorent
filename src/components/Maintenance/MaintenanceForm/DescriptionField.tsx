
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionField = ({ value, onChange }: DescriptionFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="description">{t('maintenance.descriptionField')}</Label>
      <Textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('maintenance.descriptionPlaceholder')}
        className="min-h-[100px] w-full resize-none"
        required
      />
    </div>
  );
};

export default DescriptionField;
