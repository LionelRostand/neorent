
import { Payment, Contract } from '@/types/payment';

export const findMatchingContract = (payment: Payment, contracts: Contract[]): Contract | undefined => {
  return contracts.find(contract => {
    const nameMatch = contract.tenant === payment.tenantName;
    const propertyMatch = contract.property === payment.property;
    const statusMatch = contract.status === 'Actif' || contract.status === 'Signé';
    
    console.log(`   🔎 Contrat testé:`, {
      contractTenant: contract.tenant,
      contractProperty: contract.property,
      contractStatus: contract.status,
      nameMatch,
      propertyMatch,
      statusMatch
    });
    
    return nameMatch && propertyMatch && statusMatch;
  });
};

export const extractContractAmount = (contractAmountStr: string | number, fallbackAmount: number): number => {
  let contractAmount = 0;
  
  if (typeof contractAmountStr === 'string') {
    const numericPart = contractAmountStr.replace(/[^\d]/g, '');
    contractAmount = parseInt(numericPart) || fallbackAmount;
  } else if (typeof contractAmountStr === 'number') {
    contractAmount = contractAmountStr;
  } else {
    contractAmount = fallbackAmount;
  }
  
  return contractAmount;
};
