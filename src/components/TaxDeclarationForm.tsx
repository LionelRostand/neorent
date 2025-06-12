
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useTaxCalculations } from '@/hooks/useTaxCalculations';
import TaxDeclarationHeader from './TaxDeclaration/TaxDeclarationHeader';
import YearSelector from './TaxDeclaration/YearSelector';
import PropertySelector from './TaxDeclaration/PropertySelector';
import ChargesInput from './TaxDeclaration/ChargesInput';
import TaxBracketSelector from './TaxDeclaration/TaxBracketSelector';
import TaxSummary from './TaxDeclaration/TaxSummary';

interface TaxDeclarationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TaxDeclarationForm = ({ isOpen, onClose, onSubmit }: TaxDeclarationFormProps) => {
  const currentYear = new Date().getFullYear();
  
  // États du formulaire
  const [declarationYear, setDeclarationYear] = useState(currentYear);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [selectedRoommates, setSelectedRoommates] = useState<string[]>([]);
  const [deductibleCharges, setDeductibleCharges] = useState('');
  const [taxBracket, setTaxBracket] = useState('');

  // Récupération des données
  const { properties, loading: propertiesLoading } = useFirebaseProperties();
  const { tenants, loading: tenantsLoading } = useFirebaseTenants();
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();

  // Calculs fiscaux
  const calculations = useTaxCalculations({
    properties,
    tenants,
    roommates,
    selectedProperties,
    selectedTenants,
    selectedRoommates,
    deductibleCharges,
    taxBracket
  });

  const handlePropertyChange = (propertyId: string, checked: boolean) => {
    setSelectedProperties(prev => 
      checked 
        ? [...prev, propertyId]
        : prev.filter(id => id !== propertyId)
    );
  };

  const handleTenantChange = (tenantId: string, checked: boolean) => {
    setSelectedTenants(prev => 
      checked 
        ? [...prev, tenantId]
        : prev.filter(id => id !== tenantId)
    );
  };

  const handleRoommateChange = (roommateId: string, checked: boolean) => {
    setSelectedRoommates(prev => 
      checked 
        ? [...prev, roommateId]
        : prev.filter(id => id !== roommateId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const declarationData = {
      declarationYear,
      selectedProperties,
      selectedTenants,
      selectedRoommates,
      deductibleCharges: parseFloat(deductibleCharges) || 0,
      taxBracket,
      calculations
    };

    onSubmit(declarationData);
    onClose();
    
    // Reset form
    setSelectedProperties([]);
    setSelectedTenants([]);
    setSelectedRoommates([]);
    setDeductibleCharges('');
    setTaxBracket('');
  };

  const isLoading = propertiesLoading || tenantsLoading || roommatesLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <TaxDeclarationHeader declarationYear={declarationYear} />
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des données...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <YearSelector 
              declarationYear={declarationYear}
              onYearChange={setDeclarationYear}
            />

            <PropertySelector
              properties={properties}
              tenants={tenants}
              roommates={roommates}
              selectedProperties={selectedProperties}
              selectedTenants={selectedTenants}
              selectedRoommates={selectedRoommates}
              onPropertyChange={handlePropertyChange}
              onTenantChange={handleTenantChange}
              onRoommateChange={handleRoommateChange}
            />

            <ChargesInput
              deductibleCharges={deductibleCharges}
              onChargesChange={setDeductibleCharges}
              propertyCharges={calculations.propertyCharges}
            />

            <TaxBracketSelector
              taxBracket={taxBracket}
              onTaxBracketChange={setTaxBracket}
            />

            {(selectedProperties.length > 0 || selectedTenants.length > 0 || selectedRoommates.length > 0) && taxBracket && (
              <TaxSummary
                declarationYear={declarationYear}
                totalRentalIncome={calculations.totalRentalIncome}
                totalCharges={calculations.totalCharges}
                netIncome={calculations.netIncome}
                estimatedTax={calculations.estimatedTax}
              />
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={selectedProperties.length === 0 && selectedTenants.length === 0 && selectedRoommates.length === 0 || !taxBracket}
              >
                Créer la déclaration
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaxDeclarationForm;
