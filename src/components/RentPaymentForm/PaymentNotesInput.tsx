
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PaymentNotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const PaymentNotesInput: React.FC<PaymentNotesInputProps> = ({
  notes,
  onNotesChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
        {t('rentManagement.notes')}
      </Label>
      <Input
        id="notes"
        placeholder={t('rentManagement.notesPlaceholder')}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-colors"
      />
    </div>
  );
};

export default PaymentNotesInput;
