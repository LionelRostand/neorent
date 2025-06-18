
import { useMemo } from 'react';

export interface RentData {
  baseRent: number;
  charges: number;
  totalRent: number;
  securityDeposit: number;
}

export const useRentCalculations = (baseRentAmount: number, chargesAmount: number = 0) => {
  const rentData = useMemo((): RentData => {
    const baseRent = Number(baseRentAmount) || 0;
    const charges = Number(chargesAmount) || 0;
    const totalRent = baseRent + charges;
    const securityDeposit = totalRent; // Un mois de loyer total (loyer + charges)
    
    return {
      baseRent,
      charges,
      totalRent,
      securityDeposit
    };
  }, [baseRentAmount, chargesAmount]);

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const formatCurrency = (amount: number): string => {
    return `${formatAmount(amount)}€`;
  };

  return {
    rentData,
    formatAmount,
    formatCurrency
  };
};
