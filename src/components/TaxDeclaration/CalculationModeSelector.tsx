
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface CalculationModeSelectorProps {
  calculationMode: 'monthly' | 'annual';
  onModeChange: (mode: 'monthly' | 'annual') => void;
}

const CalculationModeSelector = ({ calculationMode, onModeChange }: CalculationModeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Mode de Calcul des Loyers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={calculationMode} onValueChange={onModeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="cursor-pointer">
              Calcul mensuel (montants saisis × 1)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="annual" id="annual" />
            <Label htmlFor="annual" className="cursor-pointer">
              Calcul annuel (montants saisis × 12)
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-gray-500 mt-2">
          {calculationMode === 'annual' 
            ? "Les loyers mensuels seront automatiquement multipliés par 12 pour le calcul fiscal"
            : "Les montants saisis seront utilisés tels quels (supposés déjà annualisés)"
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default CalculationModeSelector;
