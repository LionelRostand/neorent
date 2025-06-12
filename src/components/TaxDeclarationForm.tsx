
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useTaxCalculations } from '@/hooks/useTaxCalculations';
import TaxDeclarationHeader from '@/components/TaxDeclaration/TaxDeclarationHeader';
import YearSelector from '@/components/TaxDeclaration/YearSelector';
import PropertySelector from '@/components/TaxDeclaration/PropertySelector';
import ChargesInput from '@/components/TaxDeclaration/ChargesInput';
import TaxBracketSelector from '@/components/TaxDeclaration/TaxBracketSelector';
import TaxSummary from '@/components/TaxDeclaration/TaxSummary';

interface TaxDeclarationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TaxDeclarationForm = ({ isOpen, onClose, onSubmit }: TaxDeclarationFormProps) => {
  const currentYear = new Date().getFullYear();
  const [declarationYear, setDeclarationYear] = useState(currentYear + 1);
  const [taxBracket, setTaxBracket] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [deductibleCharges, setDeductibleCharges] = useState('');
  const { toast } = useToast();
  const { properties, loading } = useFirebaseProperties();

  const {
    totalRentalIncome,
    propertyCharges,
    additionalCharges,
    totalCharges,
    netIncome,
    estimatedTax
  } = useTaxCalculations({
    properties,
    selectedProperties,
    deductibleCharges,
    taxBracket
  });

  const handlePropertyToggle = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

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
        description: "Veuillez sélectionner votre tranche d'imposition.",
        variant: "destructive",
      });
      return;
    }

    const declarationData = {
      year: declarationYear,
      selectedProperties,
      totalRentalIncome,
      propertyCharges,
      additionalCharges,
      totalCharges,
      netIncome,
      taxBracket,
      estimatedTax,
      createdAt: new Date().toISOString()
    };

    onSubmit(declarationData);
    
    toast({
      title: "Déclaration créée",
      description: `Déclaration fiscale pour ${declarationYear} créée avec succès.`,
    });

    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <TaxDeclarationHeader declarationYear={declarationYear} />
          <div className="flex items-center justify-center h-32">
            <div className="text-lg">Chargement des biens immobiliers...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <TaxDeclarationHeader declarationYear={declarationYear} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <YearSelector 
            declarationYear={declarationYear} 
            onYearChange={setDeclarationYear} 
          />

          <PropertySelector
            properties={properties}
            selectedProperties={selectedProperties}
            onPropertyToggle={handlePropertyToggle}
          />

          <ChargesInput
            deductibleCharges={deductibleCharges}
            onChargesChange={setDeductibleCharges}
            propertyCharges={propertyCharges}
          />

          <TaxBracketSelector
            taxBracket={taxBracket}
            onTaxBracketChange={setTaxBracket}
          />

          {selectedProperties.length > 0 && (
            <TaxSummary
              declarationYear={declarationYear}
              totalRentalIncome={totalRentalIncome}
              totalCharges={totalCharges}
              netIncome={netIncome}
              estimatedTax={estimatedTax}
            />
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={properties.length === 0}>
              <DollarSign className="mr-2 h-4 w-4" />
              Créer la Déclaration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxDeclarationForm;
