
import { Payment } from '@/types/payment';

export const calculatePaymentStatus = (
  paidAmount: number | undefined | null, 
  contractAmount: number
): string => {
  if (paidAmount === undefined || paidAmount === null) {
    return 'En attente';
  }

  const paid = Number(paidAmount);
  
  if (paid < contractAmount && paid > 0) {
    return 'En retard';
  } else if (paid === 0) {
    return 'En attente';
  } else if (paid >= contractAmount) {
    return 'Payé';
  }
  
  return 'En attente';
};

export const formatPaymentMethod = (method: string | null): string | null => {
  if (!method) return null;
  return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
};

export const logPaymentProcessing = (payment: Payment, contractAmount?: number) => {
  console.log(`\n🔍 TRAITEMENT DE: ${payment.tenantName}`);
  console.log(`   Propriété: ${payment.property}`);
  console.log(`   Montant actuel rentAmount: ${payment.rentAmount}€`);
  console.log(`   Montant payé: ${payment.paidAmount}€`);
  
  if (contractAmount) {
    console.log(`✅ CONTRAT TROUVÉ pour ${payment.tenantName}:`);
    console.log(`   - Montant numérique extrait: ${contractAmount}€`);
    console.log(`   - Ancien rentAmount: ${payment.rentAmount}€`);
  }
};

export const logFinalResult = (payment: Payment) => {
  console.log(`📊 RÉSULTAT FINAL pour ${payment.tenantName}:`, {
    rentAmount: payment.rentAmount,
    contractRentAmount: payment.contractRentAmount,
    paidAmount: payment.paidAmount,
    status: payment.status,
    hasDiscrepancy: payment.paidAmount !== payment.contractRentAmount
  });
};
