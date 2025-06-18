
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ChargesInputProps {
  deductibleCharges: string;
  onChargesChange: (value: string) => void;
  propertyCharges: number;
}

const ChargesInput = ({ deductibleCharges, onChargesChange, propertyCharges }: ChargesInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="charges">{t('taxes.additionalDeductibleCharges')}</Label>
      <Input
        id="charges"
        type="number"
        step="0.01"
        min="0"
        placeholder={t('taxes.chargesPlaceholder')}
        value={deductibleCharges}
        onChange={(e) => onChargesChange(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        {t('taxes.chargesDescription')}
      </p>
      {propertyCharges > 0 && (
        <p className="text-xs text-blue-600">
          {t('taxes.automaticCharges', { amount: propertyCharges.toLocaleString('fr-FR') })}
        </p>
      )}
    </div>
  );
};

export default ChargesInput;
