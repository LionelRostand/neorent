
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BankTransfer } from '@/types/bankTransfer';

interface TransferHistoryProps {
  transfers: BankTransfer[];
}

const TransferHistory: React.FC<TransferHistoryProps> = ({ transfers }) => {
  const { t } = useTranslation();

  const getStatusIcon = (status: BankTransfer['status']) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: BankTransfer['status']) => {
    switch (status) {
      case 'succeeded':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: BankTransfer['status']) => {
    switch (status) {
      case 'succeeded':
        return 'Réussi';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échec';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historique des virements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun virement effectué</p>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <div key={transfer.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transfer.status)}
                    <span className="font-semibold">{(transfer.amount / 100).toFixed(2)} €</span>
                  </div>
                  <Badge variant={getStatusVariant(transfer.status)}>
                    {getStatusLabel(transfer.status)}
                  </Badge>
                </div>
                
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Libellé:</span> {transfer.tag}</p>
                  <p><span className="font-medium">Portefeuille:</span> #{transfer.walletId}</p>
                  <p><span className="font-medium">Compte bénéficiaire:</span> #{transfer.bankAccountId}</p>
                  <p><span className="font-medium">Date de création:</span> {new Date(transfer.createdAt).toLocaleString('fr-FR')}</p>
                  {transfer.processedAt && (
                    <p><span className="font-medium">Date de traitement:</span> {new Date(transfer.processedAt).toLocaleString('fr-FR')}</p>
                  )}
                  {transfer.failureReason && (
                    <p className="text-red-600"><span className="font-medium">Raison de l'échec:</span> {transfer.failureReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferHistory;
