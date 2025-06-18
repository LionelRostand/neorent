
import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

interface PaymentAmountsProps {
  rentAmount: number;
  paidAmount?: number;
  contractRentAmount?: number;
}

const PaymentAmounts: React.FC<PaymentAmountsProps> = ({ rentAmount, paidAmount, contractRentAmount }) => {
  // PRIORITÉ ABSOLUE au contractRentAmount - C'EST LA SOURCE DE VÉRITÉ
  const expectedAmount = contractRentAmount || rentAmount;
  
  console.log('💰 PaymentAmounts - DEBUGGING AFFICHAGE:', {
    rentAmount: rentAmount,
    contractRentAmount: contractRentAmount,
    expectedAmountCalculé: expectedAmount,
    paidAmount: paidAmount,
    sourceUtilisée: contractRentAmount ? 'contractRentAmount (PRIORITÉ)' : 'rentAmount (fallback)'
  });
  
  return (
    <>
      {/* Montant du loyer mensuel à payer */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
            <div>
              <span className="text-sm font-medium text-gray-700">Loyer mensuel à payer</span>
              <p className="text-xs text-gray-500">
                {contractRentAmount ? 'Selon contrat de bail' : 'Montant estimé'}
              </p>
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-blue-600">{expectedAmount}€</span>
        </div>
      </div>

      {/* Montant du loyer mensuel payé */}
      {paidAmount !== undefined && paidAmount !== null && (
        <div className={`rounded-lg p-3 sm:p-4 mb-3 ${paidAmount === expectedAmount ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${paidAmount === expectedAmount ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm font-medium text-gray-700">Loyer mensuel payé</span>
            </div>
            <span className={`text-xl sm:text-2xl font-bold ${paidAmount === expectedAmount ? 'text-green-600' : 'text-red-600'}`}>
              {paidAmount}€
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentAmounts;
