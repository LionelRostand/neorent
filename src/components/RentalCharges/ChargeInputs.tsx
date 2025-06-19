
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('rentalCharges.chargeType')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="electricity">{t('rentalCharges.electricity')} (€)</Label>
            <Input
              id="electricity"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
              value={charges.electricity}
              onChange={(e) => onChargeChange('electricity', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="water">{t('rentalCharges.water')} (€)</Label>
            <Input
              id="water"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
              value={charges.water}
              onChange={(e) => onChargeChange('water', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heating">{t('rentalCharges.heating')} (€)</Label>
            <Input
              id="heating"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
              value={charges.heating}
              onChange={(e) => onChargeChange('heating', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maintenance">
              <div className="flex items-center gap-2">
                {t('rentalCharges.maintenance')} (€)
                <Wrench className="h-3 w-3 text-blue-500" />
                {maintenanceLoading && <span className="text-xs text-gray-500">({t('rentalCharges.calculating')})</span>}
              </div>
            </Label>
            <Input
              id="maintenance"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
              value={charges.maintenance}
              onChange={(e) => onChargeChange('maintenance', e.target.value)}
            />
            {selectedProperty && charges.maintenance && parseFloat(charges.maintenance) > 0 && (
              <p className="text-xs text-blue-600">
                {t('rentalCharges.maintenanceCosts')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance">{t('rentalCharges.insurance')} (€)</Label>
            <Input
              id="insurance"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
              value={charges.insurance}
              onChange={(e) => onChargeChange('insurance', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="garbage">{t('rentalCharges.garbage')} (€)</Label>
            <Input
              id="garbage"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
              value={charges.garbage}
              onChange={(e) => onChargeChange('garbage', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="internet">{t('rentalCharges.internet')}/TV (€)</Label>
            <Input
              id="internet"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('rentalCharges.enterAmount')}
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
