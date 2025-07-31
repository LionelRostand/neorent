
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Building2, Info } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { getPropertyChargesConfig, isChargeManagedbyCopropriete } from '@/data/propertyCharges';

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
  const { properties } = useFirebaseProperties();
  
  const selectedPropertyData = properties.find(p => p.id === selectedProperty);
  const propertyConfig = selectedPropertyData ? getPropertyChargesConfig(selectedPropertyData.title) : null;
  
  // Debug pour comprendre pourquoi maintenance est bloqué
  console.log('🏠 Propriété sélectionnée:', selectedPropertyData?.title);
  console.log('⚙️ Configuration trouvée:', propertyConfig);
  console.log('📋 Charges gérées par copropriété:', propertyConfig?.managedByCopropriete);
  
  const renderChargeField = (
    id: string,
    labelKey: string,
    value: string,
    icon?: React.ReactNode,
    isSpecial = false
  ) => {
    const isManagedByCopropriete = selectedPropertyData ? 
      isChargeManagedbyCopropriete(selectedPropertyData.title, id) : false;
    
    // Force maintenance à être modifiable temporairement
    const isFieldReadOnly = id === 'maintenance' ? false : isManagedByCopropriete;
    
    console.log(`🔧 Champ ${id}:`, {
      isManagedByCopropriete,
      isFieldReadOnly,
      propertyTitle: selectedPropertyData?.title,
      chargeType: id
    });
    
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          <div className="flex items-center gap-2">
            {t(`rentalCharges.${labelKey}`)} (€)
            {icon}
            {isManagedByCopropriete && (
              <div className="flex items-center gap-1 text-xs">
                <Building2 className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Copropriété</span>
              </div>
            )}
            {isSpecial && maintenanceLoading && <span className="text-xs text-gray-500">({t('rentalCharges.calculating')})</span>}
          </div>
        </Label>
        <Input
          id={id}
          type="number"
          step="0.01"
          min="0"
          placeholder={t('rentalCharges.enterAmount')}
          value={value}
          onChange={(e) => onChargeChange(id, e.target.value)}
          className={isManagedByCopropriete ? "border-green-200 bg-green-50" : ""}
          readOnly={isFieldReadOnly}
        />
        {isManagedByCopropriete && propertyConfig && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Montant défini par la copropriété (€{(propertyConfig.quarterlyCharges[id as keyof typeof propertyConfig.quarterlyCharges] || 0) / 3}/mois)
          </p>
        )}
        {isSpecial && selectedProperty && value && parseFloat(value) > 0 && !isManagedByCopropriete && (
          <p className="text-xs text-blue-600">
            {t('rentalCharges.maintenanceCosts')}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('rentalCharges.chargeType')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {propertyConfig && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-1">
              Configuration automatique des charges de copropriété
            </p>
            <p className="text-xs text-blue-600">
              Les charges marquées "Copropriété" sont automatiquement calculées (montants trimestriels divisés par 3)
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderChargeField('electricity', 'electricity', charges.electricity)}
          {renderChargeField('water', 'water', charges.water)}
          {renderChargeField('heating', 'heating', charges.heating)}
          {renderChargeField('maintenance', 'maintenance', charges.maintenance, <Wrench className="h-3 w-3 text-blue-500" />, true)}
          {renderChargeField('insurance', 'insurance', charges.insurance)}
          {renderChargeField('garbage', 'garbage', charges.garbage)}
          
          <div className="md:col-span-2">
            {renderChargeField('internet', 'internet', charges.internet)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeInputs;
