import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useTaxCalculations } from '@/hooks/useTaxCalculations';
import TaxDeclarationHeader from './TaxDeclaration/TaxDeclarationHeader';
import YearSelector from './TaxDeclaration/YearSelector';
import PropertyOccupantSelector from './TaxDeclaration/PropertyOccupantSelector';
import ChargesInput from './TaxDeclaration/ChargesInput';
import TaxBracketSelector from './TaxDeclaration/TaxBracketSelector';
import TaxSummary from './TaxDeclaration/TaxSummary';
import { generateTaxDeclarationPDF } from '@/services/taxDeclarationPdfService';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import { useToast } from '@/hooks/use-toast';

interface TaxDeclarationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TaxDeclarationForm = ({ isOpen, onClose, onSubmit }: TaxDeclarationFormProps) => {
  const currentYear = new Date().getFullYear();
  
  // États du formulaire - simplifié
  const [declarationYear, setDeclarationYear] = useState(currentYear);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [deductibleCharges, setDeductibleCharges] = useState('');
  const [taxBracket, setTaxBracket] = useState('');

  // Récupération des données
  const { properties, loading: propertiesLoading } = useFirebaseProperties();
  const { tenants, loading: tenantsLoading } = useFirebaseTenants();
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();

  // Calculs fiscaux avec les sélections automatiques des occupants
  const calculations = useTaxCalculations({
    properties,
    tenants,
    roommates,
    selectedProperties,
    selectedTenants: [], // Géré automatiquement via les biens
    selectedRoommates: [], // Géré automatiquement via les biens
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

  const { companyInfo } = useCompanyInfo();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProperties.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un bien immobilier.",
        variant: "destructive",
      });
      return;
    }

    if (!taxBracket) {
      toast({
        title: "Erreur", 
        description: "Veuillez sélectionner une tranche d'imposition.",
        variant: "destructive",
      });
      return;
    }
    
    const declarationData = {
      declarationYear,
      selectedProperties,
      deductibleCharges: parseFloat(deductibleCharges) || 0,
      taxBracket,
      calculations
    };

    try {
      // Générer et télécharger le PDF
      const fileName = generateTaxDeclarationPDF(declarationData, companyInfo);
      
      toast({
        title: "Succès",
        description: `Déclaration fiscale générée: ${fileName}`,
      });

      // Appeler la fonction onSubmit du parent
      onSubmit(declarationData);
      
      // Fermer le modal
      onClose();
      
      // Reset form
      setSelectedProperties([]);
      setDeductibleCharges('');
      setTaxBracket('');
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la déclaration fiscale.",
        variant: "destructive",
      });
    }
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

            <PropertyOccupantSelector
              properties={properties}
              tenants={tenants}
              roommates={roommates}
              selectedProperties={selectedProperties}
              onPropertyChange={handlePropertyChange}
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

            {selectedProperties.length > 0 && taxBracket && (
              <TaxSummary
                declarationYear={declarationYear}
                totalRentalIncome={calculations.totalRentalIncome}
                totalCharges={calculations.totalCharges}
                netIncome={calculations.netIncome}
                estimatedTax={calculations.estimatedTax}
                taxBracket={taxBracket}
              />
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={selectedProperties.length === 0 || !taxBracket}
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
