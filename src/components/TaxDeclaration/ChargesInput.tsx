
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ChargesInputProps {
  deductibleCharges: string;
  onChargesChange: (value: string) => void;
  propertyCharges: number;
}

const ChargesInput = ({ deductibleCharges, onChargesChange, propertyCharges }: ChargesInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="charges">Charges déductibles supplémentaires (€)</Label>
      <Input
        id="charges"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={deductibleCharges}
        onChange={(e) => onChargesChange(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Frais de gestion, travaux, assurances, intérêts d'emprunt, etc. (en plus des charges automatiques des biens)
      </p>
      {propertyCharges > 0 && (
        <p className="text-xs text-blue-600">
          Charges automatiques des biens sélectionnés: {propertyCharges.toLocaleString('fr-FR')}€/an
        </p>
      )}
    </div>
  );
};

export default ChargesInput;
