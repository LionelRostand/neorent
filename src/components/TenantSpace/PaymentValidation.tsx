
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentValidationProps {
  paidAmount: string;
  totalAmount: number;
  isFormValid: boolean;
}

const PaymentValidation: React.FC<PaymentValidationProps> = ({
  paidAmount,
  totalAmount,
  isFormValid
}) => {
  const { t } = useTranslation();
  const paidAmountNum = parseFloat(paidAmount) || 0;
  const hasDiscrepancy = paidAmount && paidAmountNum !== totalAmount && paidAmountNum > 0;
  const isFullPayment = paidAmountNum === totalAmount;

  return (
    <>
      {/* Alerte de discordance */}
      {hasDiscrepancy && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-800">{t('tenantSpace.payment.amountDifference')}</p>
              <p className="text-red-700">
                {t('tenantSpace.payment.amountEntered')}: <span className="font-semibold">{paidAmountNum}€</span> • 
                {t('tenantSpace.payment.expectedAmount')}: <span className="font-semibold">{totalAmount}€</span>
              </p>
              <p className="text-xs text-red-600 mt-1">
                {paidAmountNum < totalAmount 
                  ? `${t('tenantSpace.payment.missing')}: ${(totalAmount - paidAmountNum).toFixed(2)}€`
                  : `${t('tenantSpace.payment.surplus')}: ${(paidAmountNum - totalAmount).toFixed(2)}€`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation paiement complet */}
      {isFullPayment && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              {t('tenantSpace.payment.correctAmount')}
            </p>
          </div>
        </div>
      )}

      {/* Validation form indicator */}
      {!isFormValid && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">
              {t('tenantSpace.payment.fillAllFields')}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentValidation;
