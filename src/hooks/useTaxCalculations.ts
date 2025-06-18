
import { useMemo } from 'react';
import { calculateTaxForCountry, getCurrencySymbol } from '@/utils/taxBrackets';

interface Property {
  id: string;
  rent: string;
  charges?: Record<string, any>;
  tenant?: string | null;
}

interface Tenant {
  id: string;
  rentAmount: string;
  property: string;
}

interface Roommate {
  id: string;
  rentAmount: string;
  property: string;
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
  country: string;
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
  country
}: UseTaxCalculationsProps) => {
  
  const calculations = useMemo(() => {
    let totalRentalIncome = 0;
    const currencySymbol = getCurrencySymbol(country);

    // Calcul des revenus des biens immobiliers (annualisé automatiquement)
    selectedProperties.forEach(propertyId => {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        const monthlyRent = parseFloat(property.rent) || 0;
        totalRentalIncome += monthlyRent * 12; // Calcul annuel automatique
      }
    });

    // Calcul des revenus des locataires (annualisé automatiquement)
    selectedTenants.forEach(tenantId => {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
        const monthlyRent = parseFloat(tenant.rentAmount) || 0;
        totalRentalIncome += monthlyRent * 12; // Calcul annuel automatique
      }
    });

    // Calcul des revenus des colocataires (annualisé automatiquement)
    selectedRoommates.forEach(roommateId => {
      const roommate = roommates.find(r => r.id === roommateId);
      if (roommate) {
        const monthlyRent = parseFloat(roommate.rentAmount) || 0;
        totalRentalIncome += monthlyRent * 12; // Calcul annuel automatique
      }
    });

    // Calcul des charges liées aux biens (annualisé automatiquement)
    let propertyCharges = 0;
    selectedProperties.forEach(propertyId => {
      const property = properties.find(p => p.id === propertyId);
      if (property && property.charges) {
        const monthlyCharges = Object.values(property.charges).reduce((sum: number, charge: any) => {
          const chargeValue = parseFloat(String(charge)) || 0;
          return sum + chargeValue;
        }, 0);
        propertyCharges += monthlyCharges * 12; // Calcul annuel automatique
      }
    });

    const additionalCharges = parseFloat(deductibleCharges) || 0;
    const totalCharges = propertyCharges + additionalCharges;
    const netIncome = Math.max(0, totalRentalIncome - totalCharges);

    // Calcul de l'impôt estimé selon le pays et la tranche
    const estimatedTax = calculateTaxForCountry(netIncome, country);

    return {
      totalRentalIncome,
      propertyCharges,
      additionalCharges,
      totalCharges,
      netIncome,
      estimatedTax,
      currencySymbol
    };
  }, [properties, tenants, roommates, selectedProperties, selectedTenants, selectedRoommates, deductibleCharges, taxBracket, country]);

  return calculations;
};
