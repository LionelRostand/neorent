
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMaintenanceCostCalculator } from '@/hooks/useMaintenanceCostCalculator';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import { getPropertyChargesConfig, getMonthlyChargesFromQuarterly } from '@/data/propertyCharges';
import PropertySelector from '@/components/RentalCharges/PropertySelector';
import ChargeInputs from '@/components/RentalCharges/ChargeInputs';
import ChargeSummary from '@/components/RentalCharges/ChargeSummary';

interface RentalChargeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const RentalChargeForm = ({ isOpen, onClose, onSubmit }: RentalChargeFormProps) => {
  const { t } = useTranslation();
  const [selectedProperty, setSelectedProperty] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [charges, setCharges] = useState({
    electricity: '',
    water: '',
    heating: '',
    maintenance: '',
    insurance: '',
    garbage: '',
    internet: ''
  });
  const { toast } = useToast();
  const { properties } = useFirebaseProperties();
  const { interventions, requests, loading: maintenanceLoading } = useFirebaseMaintenances();

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  // Appliquer automatiquement les charges de copropriété quand une propriété est sélectionnée
  React.useEffect(() => {
    if (selectedPropertyData) {
      const config = getPropertyChargesConfig(selectedPropertyData.title);
      if (config) {
        const monthlyCharges = getMonthlyChargesFromQuarterly(config.quarterlyCharges);
        
        setCharges(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(monthlyCharges).map(([key, value]) => [key, value.toString()])
          )
        }));
      }
    }
  }, [selectedPropertyData]);

  useMaintenanceCostCalculator({
    selectedProperty,
    month,
    selectedPropertyName: selectedPropertyData?.title,
    interventions,
    requests,
    onCostCalculated: (cost) => {
      // Ne pas écraser si la charge est gérée par la copropriété
      const config = selectedPropertyData ? getPropertyChargesConfig(selectedPropertyData.title) : null;
      const isMaintenanceManaged = config?.managedByCopropriete.includes('maintenance');
      
      if (!isMaintenanceManaged) {
        setCharges(prev => ({
          ...prev,
          maintenance: cost
        }));
      }
    }
  });

  const handleChargeChange = (field: string, value: string) => {
    setCharges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return Object.values(charges).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty) {
      toast({
        title: t('common.error'),
        description: t('rentalCharges.selectProperty'),
        variant: "destructive",
      });
      return;
    }

    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return;

    const chargeData = {
      propertyName: property.title,
      propertyType: property.locationType,
      tenant: property.tenant,
      month,
      electricity: parseFloat(charges.electricity) || 0,
      water: parseFloat(charges.water) || 0,
      heating: parseFloat(charges.heating) || 0,
      maintenance: parseFloat(charges.maintenance) || 0,
      insurance: parseFloat(charges.insurance) || 0,
      garbage: parseFloat(charges.garbage) || 0,
      internet: parseFloat(charges.internet) || 0,
      total: calculateTotal(),
    };

    onSubmit(chargeData);
    
    toast({
      title: t('rentalCharges.addSuccess'),
      description: `${t('rentalCharges.chargesForMonth')} ${property.title} ${t('rentalCharges.addSuccess').toLowerCase()}.`,
    });

    // Reset form
    setSelectedProperty('');
    setCharges({
      electricity: '',
      water: '',
      heating: '',
      maintenance: '',
      insurance: '',
      garbage: '',
      internet: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('rentalCharges.addCharge')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PropertySelector
            selectedProperty={selectedProperty}
            onPropertyChange={setSelectedProperty}
          />

          <div className="space-y-2">
            <Label htmlFor="month">{t('rentalCharges.month')}</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <ChargeInputs
            charges={charges}
            onChargeChange={handleChargeChange}
            selectedProperty={selectedProperty}
            maintenanceLoading={maintenanceLoading}
          />

          <ChargeSummary total={calculateTotal()} />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <DollarSign className="mr-2 h-4 w-4" />
              {t('rentalCharges.recordCharges')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RentalChargeForm;
