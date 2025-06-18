
import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

interface PaymentAmountsProps {
  rentAmount: number;
  paidAmount?: number;
}

const PaymentAmounts: React.FC<PaymentAmountsProps> = ({ rentAmount, paidAmount }) => {
  return (
    <>
      {/* Montant du loyer mensuel à payer (selon contrat) */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
            <div>
              <span className="text-sm font-medium text-gray-700">Loyer mensuel à payer</span>
              <p className="text-xs text-gray-500">Selon contrat de bail</p>
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-blue-600">{rentAmount}€</span>
        </div>
      </div>

      {/* Montant du loyer mensuel payé (si différent) */}
      {paidAmount !== undefined && paidAmount !== null && (
        <div className={`rounded-lg p-3 sm:p-4 mb-3 ${paidAmount === rentAmount ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${paidAmount === rentAmount ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm font-medium text-gray-700">Loyer mensuel payé</span>
            </div>
            <span className={`text-xl sm:text-2xl font-bold ${paidAmount === rentAmount ? 'text-green-600' : 'text-red-600'}`}>
              {paidAmount}€
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentAmounts;
