
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DateAmountFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

const DateAmountFields = ({ formData, handleInputChange }: DateAmountFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="startDate">{t('contractForm.startDate')}</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="endDate">{t('contractForm.endDate')}</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleInputChange('endDate', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="amount">{t('contractForm.amount')}</Label>
        <Input
          id="amount"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          placeholder={t('contractForm.amountPlaceholder')}
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">{t('contractForm.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder={t('contractForm.descriptionPlaceholder')}
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default DateAmountFields;
