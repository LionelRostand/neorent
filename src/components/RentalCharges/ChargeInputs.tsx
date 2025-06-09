
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

interface ChargesData {
  electricity: string;
  water: string;
  heating: string;
  maintenance: string;
  insurance: string;
  garbage: string;
  internet: string;
}

interface ChargeInputsProps {
  charges: ChargesData;
  onChargeChange: (field: string, value: string) => void;
  selectedProperty: string;
  maintenanceLoading: boolean;
}

const ChargeInputs = ({ charges, onChargeChange, selectedProperty, maintenanceLoading }: ChargeInputsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Détail des charges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="electricity">Électricité (€)</Label>
            <Input
              id="electricity"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.electricity}
              onChange={(e) => onChargeChange('electricity', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="water">Eau (€)</Label>
            <Input
              id="water"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.water}
              onChange={(e) => onChargeChange('water', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heating">Chauffage (€)</Label>
            <Input
              id="heating"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.heating}
              onChange={(e) => onChargeChange('heating', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maintenance">
              <div className="flex items-center gap-2">
                Entretien (€)
                <Wrench className="h-3 w-3 text-blue-500" />
                {maintenanceLoading && <span className="text-xs text-gray-500">(calcul...)</span>}
              </div>
            </Label>
            <Input
              id="maintenance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.maintenance}
              onChange={(e) => onChargeChange('maintenance', e.target.value)}
            />
            {selectedProperty && charges.maintenance && parseFloat(charges.maintenance) > 0 && (
              <p className="text-xs text-blue-600">
                Coût calculé automatiquement depuis les interventions terminées à la charge du propriétaire
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance">Assurance (€)</Label>
            <Input
              id="insurance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.insurance}
              onChange={(e) => onChargeChange('insurance', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="garbage">Ordures ménagères (€)</Label>
            <Input
              id="garbage"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.garbage}
              onChange={(e) => onChargeChange('garbage', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="internet">Internet/TV (€)</Label>
            <Input
              id="internet"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges.internet}
              onChange={(e) => onChargeChange('internet', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeInputs;
