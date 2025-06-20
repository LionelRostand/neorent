
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
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
    <div className="space-y-2 sm:space-y-3">
      <Label htmlFor="notes" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
        <span className="truncate">{t('rentManagement.notes')}</span>
        <span className="text-gray-500 text-xs">({t('common.optional')})</span>
      </Label>
      <Input
        id="notes"
        placeholder={t('rentManagement.notesPlaceholder')}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="h-10 sm:h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-gray-500 transition-colors text-sm sm:text-base"
      />
    </div>
  );
};

export default PaymentNotesInput;
