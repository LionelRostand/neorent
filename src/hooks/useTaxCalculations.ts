
import { useMemo } from 'react';

interface Property {
  id: string;
  rent: string;
  charges?: Record<string, any>;
}

interface UseTaxCalculationsProps {
  properties: Property[];
  selectedProperties: string[];
  deductibleCharges: string;
  taxBracket: string;
}

export const useTaxCalculations = ({
  properties,
  selectedProperties,
  deductibleCharges,
  taxBracket
}: UseTaxCalculationsProps) => {
  
  const calculations = useMemo(() => {
    // Calcul des revenus locatifs
    let totalRentalIncome = 0;
    selectedProperties.forEach(propertyId => {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        const monthlyRent = parseFloat(property.rent) || 0;
        totalRentalIncome += monthlyRent * 12;
      }
    });

    // Calcul des charges liées aux biens
    let propertyCharges = 0;
    selectedProperties.forEach(propertyId => {
      const property = properties.find(p => p.id === propertyId);
      if (property && property.charges) {
        const monthlyCharges = Object.values(property.charges).reduce((sum: number, charge: any) => {
          const chargeValue = parseFloat(String(charge)) || 0;
          return sum + chargeValue;
        }, 0);
        propertyCharges += monthlyCharges * 12;
      }
    });

    const additionalCharges = parseFloat(deductibleCharges) || 0;
    const totalCharges = propertyCharges + additionalCharges;
    const netIncome = Math.max(0, totalRentalIncome - totalCharges);

    // Calcul de l'impôt estimé
    let estimatedTax = 0;
    switch (taxBracket) {
      case '11':
        estimatedTax = netIncome * 0.11;
        break;
      case '30':
        estimatedTax = netIncome * 0.30;
        break;
      case '41':
        estimatedTax = netIncome * 0.41;
        break;
      case '45':
        estimatedTax = netIncome * 0.45;
        break;
      default:
        estimatedTax = 0;
    }

    return {
      totalRentalIncome,
      propertyCharges,
      additionalCharges,
      totalCharges,
      netIncome,
      estimatedTax
    };
  }, [properties, selectedProperties, deductibleCharges, taxBracket]);

  return calculations;
};
