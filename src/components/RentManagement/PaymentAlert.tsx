
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PaymentAlertProps {
  expectedAmount: number;
  paidAmount: number;
  tenantName: string;
  className?: string;
}

const PaymentAlert: React.FC<PaymentAlertProps> = ({ 
  expectedAmount, 
  paidAmount, 
  tenantName,
  className = "" 
}) => {
  const isPaidInFull = paidAmount >= expectedAmount;
  const remainingAmount = Math.max(expectedAmount - paidAmount, 0);
  const overpayment = Math.max(paidAmount - expectedAmount, 0);

  if (isPaidInFull && overpayment === 0) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <span className="font-medium">{tenantName}</span> a payé le loyer en totalité ({paidAmount.toLocaleString()}€)
        </AlertDescription>
      </Alert>
    );
  }

  if (remainingAmount > 0) {
    return (
      <Alert className={`border-red-200 bg-red-50 ${className}`}>
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="space-y-1">
            <div>
              <span className="font-medium">{tenantName}</span> - Paiement incomplet
            </div>
            <div className="text-sm">
              Montant attendu: <span className="font-semibold">{expectedAmount.toLocaleString()}€</span>
            </div>
            <div className="text-sm">
              Montant payé: <span className="font-semibold">{paidAmount.toLocaleString()}€</span>
            </div>
            <Badge variant="destructive" className="text-xs">
              Reste à payer: {remainingAmount.toLocaleString()}€
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (overpayment > 0) {
    return (
      <Alert className={`border-yellow-200 bg-yellow-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="space-y-1">
            <div>
              <span className="font-medium">{tenantName}</span> - Trop-perçu
            </div>
            <div className="text-sm">
              Montant attendu: <span className="font-semibold">{expectedAmount.toLocaleString()}€</span>
            </div>
            <div className="text-sm">
              Montant payé: <span className="font-semibold">{paidAmount.toLocaleString()}€</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Trop-perçu: +{overpayment.toLocaleString()}€
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default PaymentAlert;
