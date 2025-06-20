
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Euro, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingPayment {
  id: string;
  tenantName: string;
  tenantType: 'Locataire' | 'Colocataire';
  property: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes?: string;
  validationStatus: 'pending' | 'validated' | 'rejected';
}

interface PaymentValidationPanelProps {
  pendingPayments: PendingPayment[];
  onValidatePayment: (paymentId: string, decision: 'validated' | 'rejected', comment?: string) => void;
  onGenerateReceipt: (payment: PendingPayment) => void;
}

const PaymentValidationPanel: React.FC<PaymentValidationPanelProps> = ({
  pendingPayments,
  onValidatePayment,
  onGenerateReceipt
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [validationComments, setValidationComments] = useState<Record<string, string>>({});
  const [processingPayments, setProcessingPayments] = useState<Set<string>>(new Set());

  const handleValidation = async (paymentId: string, decision: 'validated' | 'rejected') => {
    setProcessingPayments(prev => new Set(prev).add(paymentId));
    
    try {
      const comment = validationComments[paymentId] || '';
      await onValidatePayment(paymentId, decision, comment);
      
      // Si validation positive, générer automatiquement le reçu
      if (decision === 'validated') {
        const payment = pendingPayments.find(p => p.id === paymentId);
        if (payment) {
          setTimeout(() => {
            onGenerateReceipt(payment);
          }, 1000);
        }
      }
      
      toast({
        title: decision === 'validated' ? 'Virement validé' : 'Virement rejeté',
        description: decision === 'validated' 
          ? 'Le paiement a été confirmé et la quittance a été générée automatiquement.'
          : 'Le paiement a été rejeté. Le locataire en sera informé.',
      });
      
      // Réinitialiser le commentaire
      setValidationComments(prev => {
        const newComments = { ...prev };
        delete newComments[paymentId];
        return newComments;
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de valider le paiement. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const pendingCount = pendingPayments.filter(p => p.validationStatus === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Validation des virements
          {pendingCount > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {pendingCount} en attente
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingPayments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Aucun virement en attente
            </h3>
            <p className="mt-2 text-gray-500">
              Tous les virements ont été traités.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">{payment.tenantName}</h4>
                    <p className="text-sm text-gray-600">{payment.property}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Type: {payment.tenantType}</span>
                      <span>Date: {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
                      <span>Mode: {payment.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                      <Euro className="h-4 w-4" />
                      {payment.amount}€
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        payment.validationStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : payment.validationStatus === 'validated'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {payment.validationStatus === 'pending' && 'En attente'}
                      {payment.validationStatus === 'validated' && 'Validé'}
                      {payment.validationStatus === 'rejected' && 'Rejeté'}
                    </Badge>
                  </div>
                </div>

                {payment.notes && (
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Note du locataire:</strong> {payment.notes}
                  </div>
                )}

                {payment.validationStatus === 'pending' && (
                  <div className="space-y-3 border-t pt-3">
                    <Textarea
                      placeholder="Commentaire optionnel sur la validation..."
                      value={validationComments[payment.id] || ''}
                      onChange={(e) => setValidationComments(prev => ({
                        ...prev,
                        [payment.id]: e.target.value
                      }))}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleValidation(payment.id, 'validated')}
                        disabled={processingPayments.has(payment.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {processingPayments.has(payment.id) ? 'Validation...' : 'Valider le virement'}
                      </Button>
                      <Button
                        onClick={() => handleValidation(payment.id, 'rejected')}
                        disabled={processingPayments.has(payment.id)}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                )}

                {payment.validationStatus === 'validated' && (
                  <div className="border-t pt-3">
                    <Button
                      onClick={() => onGenerateReceipt(payment)}
                      variant="outline"
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Régénérer la quittance
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentValidationPanel;
