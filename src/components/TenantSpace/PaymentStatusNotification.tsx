
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface PaymentStatusNotificationProps {
  pendingPayments: Array<{
    id: string;
    tenantName: string;
    amount: number;
    paymentDate: string;
    validationStatus: 'pending' | 'validated' | 'rejected';
    validatedAt?: string;
    receiptGenerated?: boolean;
  }>;
  onDownloadReceipt?: (paymentId: string) => void;
}

const PaymentStatusNotification: React.FC<PaymentStatusNotificationProps> = ({
  pendingPayments,
  onDownloadReceipt
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Votre virement est en cours de vérification par le bailleur. Vous recevrez votre quittance dès que le virement sera confirmé.';
      case 'validated':
        return 'Votre virement a été confirmé ! Votre quittance est maintenant disponible.';
      case 'rejected':
        return 'Le virement n\'a pas été confirmé. Veuillez contacter votre bailleur pour plus d\'informations.';
      default:
        return 'Statut de validation inconnu.';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'validated':
        return 'border-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (pendingPayments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {pendingPayments.map((payment) => (
        <Card key={payment.id} className={`${getStatusColor(payment.validationStatus)} border-l-4`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {getStatusIcon(payment.validationStatus)}
              Statut de votre virement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut :</span>
              {getStatusBadge(payment.validationStatus)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Montant :</span>
                <span className="font-medium">{payment.amount}€</span>
              </div>
              <div className="flex justify-between">
                <span>Date du virement :</span>
                <span>{new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
              </div>
              {payment.validatedAt && (
                <div className="flex justify-between">
                  <span>Validé le :</span>
                  <span>{new Date(payment.validatedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>

            <div className={`p-3 rounded-lg border ${getStatusColor(payment.validationStatus)}`}>
              <p className="text-sm">
                {payment.validationStatus === 'pending' && '💡 '}
                {payment.validationStatus === 'validated' && '✅ '}
                {payment.validationStatus === 'rejected' && '❌ '}
                {getStatusMessage(payment.validationStatus)}
              </p>
            </div>

            {payment.validationStatus === 'validated' && payment.receiptGenerated && onDownloadReceipt && (
              <div className="flex justify-end">
                <Button
                  onClick={() => onDownloadReceipt(payment.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Télécharger la quittance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentStatusNotification;
