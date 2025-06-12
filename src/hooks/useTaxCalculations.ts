
import { useMemo } from 'react';

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
}

export const useTaxCalculations = ({
  properties,
  tenants,
  roommates,
  selectedProperties,
  selectedTenants,
  selectedRoommates,
  deductibleCharges,
  taxBracket
}: UseTaxCalculationsProps) => {
  
  const calculations = useMemo(() => {
    let totalRentalIncome = 0;

    // Calcul des revenus en fonction des sélections
    selectedProperties.forEach(itemId => {
      if (itemId.startsWith('tenant-')) {
        // C'est un locataire
        const tenantId = itemId.replace('tenant-', '');
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
          const monthlyRent = parseFloat(tenant.rentAmount) || 0;
          totalRentalIncome += monthlyRent * 12; // Calcul annuel automatique
        }
      } else if (itemId.startsWith('roommate-')) {
        // C'est un colocataire
        const roommateId = itemId.replace('roommate-', '');
        const roommate = roommates.find(r => r.id === roommateId);
        if (roommate) {
          const monthlyRent = parseFloat(roommate.rentAmount) || 0;
          totalRentalIncome += monthlyRent * 12; // Calcul annuel automatique
        }
      } else {
        // C'est une propriété
        const property = properties.find(p => p.id === itemId);
        if (property) {
          const monthlyRent = parseFloat(property.rent) || 0;
          totalRentalIncome += monthlyRent * 12; // Calcul annuel automatique
        }
      }
    });

    // Calcul des charges liées aux biens sélectionnés
    let propertyCharges = 0;
    selectedProperties.forEach(itemId => {
      // Seulement pour les propriétés directes
      if (!itemId.startsWith('tenant-') && !itemId.startsWith('roommate-')) {
        const property = properties.find(p => p.id === itemId);
        if (property && property.charges) {
          const monthlyCharges = Object.values(property.charges).reduce((sum: number, charge: any) => {
            const chargeValue = parseFloat(String(charge)) || 0;
            return sum + chargeValue;
          }, 0);
          propertyCharges += monthlyCharges * 12; // Calcul annuel automatique
        }
      }
    });

    const additionalCharges = parseFloat(deductibleCharges) || 0;
    const totalCharges = propertyCharges + additionalCharges;
    const netIncome = Math.max(0, totalRentalIncome - totalCharges);

    // Calcul de l'impôt estimé selon la tranche
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
  }, [properties, tenants, roommates, selectedProperties, selectedTenants, selectedRoommates, deductibleCharges, taxBracket]);

  return calculations;
};
