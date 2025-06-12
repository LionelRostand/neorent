
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaxBracketSelectorProps {
  taxBracket: string;
  onTaxBracketChange: (bracket: string) => void;
}

const TaxBracketSelector = ({ taxBracket, onTaxBracketChange }: TaxBracketSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="taxBracket">Votre tranche marginale d'imposition</Label>
      <Select value={taxBracket} onValueChange={onTaxBracketChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner votre tranche d'imposition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="11">11% (jusqu'à 10 777€)</SelectItem>
          <SelectItem value="30">30% (de 10 778€ à 27 478€)</SelectItem>
          <SelectItem value="41">41% (de 27 479€ à 78 570€)</SelectItem>
          <SelectItem value="45">45% (plus de 78 570€)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaxBracketSelector;
