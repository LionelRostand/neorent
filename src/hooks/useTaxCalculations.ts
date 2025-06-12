
import { useMemo } from 'react';

interface Property {
  id: string;
  rent: string;
  charges?: Record<string, any>;
}

interface Tenant {
  id: string;
  rentAmount: string;
}

interface Roommate {
  id: string;
  rentAmount: string; // Harmonisé avec useFirebaseRoommates
}

interface UseTaxCalculationsProps {
  properties: Property[];
  tenants: Tenant[];
  roommates: Roommate[];
  selectedProperties: string[];
  selectedTenants: string[];
  selectedRoommates: string[];
  deductibleCharges: string;
  taxBracket: string;
  calculationMode: 'monthly' | 'annual';
}

export const useTaxCalculations = ({
  properties,
  tenants,
  roommates,
  selectedProperties,
  selectedTenants,
  selectedRoommates,
  deductibleCharges,
  taxBracket,
  calculationMode
}: UseTaxCalculationsProps) => {
  
  const calculations = useMemo(() => {
    let totalRentalIncome = 0;
    const multiplier = calculationMode === 'annual' ? 12 : 1;

    // Calcul des revenus des biens immobiliers
    selectedProperties.forEach(propertyId => {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        const monthlyRent = parseFloat(property.rent) || 0;
        totalRentalIncome += monthlyRent * multiplier;
      }
    });

    // Calcul des revenus des locataires
    selectedTenants.forEach(tenantId => {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
        const monthlyRent = parseFloat(tenant.rentAmount) || 0;
        totalRentalIncome += monthlyRent * multiplier;
      }
    });

    // Calcul des revenus des colocataires
    selectedRoommates.forEach(roommateId => {
      const roommate = roommates.find(r => r.id === roommateId);
      if (roommate) {
        const monthlyRent = parseFloat(roommate.rentAmount) || 0;
        totalRentalIncome += monthlyRent * multiplier;
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
        propertyCharges += monthlyCharges * multiplier;
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
  }, [properties, tenants, roommates, selectedProperties, selectedTenants, selectedRoommates, deductibleCharges, taxBracket, calculationMode]);

  return calculations;
};
