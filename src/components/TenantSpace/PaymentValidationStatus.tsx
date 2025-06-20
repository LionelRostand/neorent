
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface PaymentValidationStatusProps {
  payment: {
    id: string;
    tenantName: string;
    amount: number;
    paymentDate: string;
    status: string;
    validationStatus?: 'pending' | 'validated' | 'rejected';
    validatedAt?: string;
    validatedBy?: string;
    receiptGenerated?: boolean;
  };
  onDownloadReceipt?: () => void;
}

const PaymentValidationStatus: React.FC<PaymentValidationStatusProps> = ({
  payment,
  onDownloadReceipt
}) => {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (payment.validationStatus) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (payment.validationStatus) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            En attente de validation
          </Badge>
        );
      case 'validated':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Virement validé
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Virement rejeté
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Statut inconnu
          </Badge>
        );
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Statut du virement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Statut de validation :</span>
          {getStatusBadge()}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Montant :</span>
            <span className="font-medium">{payment.amount}€</span>
          </div>
          <div className="flex justify-between">
            <span>Date de paiement :</span>
            <span>{new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
          </div>
          {payment.validatedAt && (
            <div className="flex justify-between">
              <span>Validé le :</span>
              <span>{new Date(payment.validatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>

        {payment.validationStatus === 'pending' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 Votre virement est en cours de vérification par le bailleur. 
              Vous recevrez votre quittance dès que le virement sera confirmé.
            </p>
          </div>
        )}

        {payment.validationStatus === 'validated' && payment.receiptGenerated && onDownloadReceipt && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-800">
                ✅ Virement confirmé ! Votre quittance est disponible.
              </p>
              <button
                onClick={onDownloadReceipt}
                className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
              >
                <FileText className="h-3 w-3" />
                Télécharger
              </button>
            </div>
          </div>
        )}

        {payment.validationStatus === 'rejected' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ❌ Le virement n'a pas été confirmé. Veuillez contacter votre bailleur 
              ou vérifier les informations de paiement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentValidationStatus;
