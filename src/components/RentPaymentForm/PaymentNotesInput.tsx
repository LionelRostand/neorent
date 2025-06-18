
import React from 'react';
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
  return (
    <div className="space-y-3">
      <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
        Notes (optionnel)
      </Label>
      <Input
        id="notes"
        placeholder="Commentaires ou remarques sur ce règlement..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-colors"
      />
    </div>
  );
};

export default PaymentNotesInput;
