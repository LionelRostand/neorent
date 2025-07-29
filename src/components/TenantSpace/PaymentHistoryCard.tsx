import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, CreditCard, Banknote, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// import { generateRentReceipt } from '@/services/receiptPdfService';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'bank-transfer' | 'cash' | 'online' | 'check';
  reference?: string;
  status: 'paid' | 'processing' | 'declared' | 'failed';
  description?: string;
}

interface PaymentHistoryCardProps {
  payments: Payment[];
  tenantData: any;
  propertyData: any;
}

const PaymentHistoryCard = ({ payments, tenantData, propertyData }: PaymentHistoryCardProps) => {
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'bank-transfer':
        return <Banknote className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'online':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank-transfer':
        return 'Virement bancaire';
      case 'cash':
        return 'Espèces';
      case 'online':
        return 'Paiement en ligne';
      case 'check':
        return 'Chèque';
      default:
        return 'Autre';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Payé</Badge>;
      case 'processing':
        return <Badge variant="secondary">En cours</Badge>;
      case 'declared':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Déclaré</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownloadReceipt = async (payment: Payment) => {
    try {
      // Génération simplifiée de la quittance pour le moment
      console.log('Génération de la quittance pour:', payment);
      
      // Simuler la génération d'une quittance
      const receiptData = {
        tenant: tenantData?.name || 'Nom du locataire',
        amount: payment.amount,
        date: payment.date,
        method: getPaymentMethodLabel(payment.method),
        reference: payment.reference || '',
        period: format(new Date(payment.date), 'MMMM yyyy', { locale: fr })
      };
      
      // Ici, l'intégration avec le service PDF se fera après la connexion Supabase
      alert(`Quittance générée pour ${receiptData.tenant} - ${receiptData.amount}€ - ${receiptData.period}`);
    } catch (error) {
      console.error('Erreur lors de la génération de la quittance:', error);
    }
  };

  // Données d'exemple si aucun paiement
  const samplePayments: Payment[] = [
    {
      id: '1',
      date: '2025-01-15',
      amount: 450,
      method: 'bank-transfer',
      reference: 'VIR202501001',
      status: 'paid',
      description: 'Loyer janvier 2025'
    },
    {
      id: '2',
      date: '2024-12-15',
      amount: 450,
      method: 'online',
      reference: 'PAY202412001',
      status: 'paid',
      description: 'Loyer décembre 2024'
    },
    {
      id: '3',
      date: '2024-11-15',
      amount: 450,
      method: 'cash',
      status: 'declared',
      description: 'Loyer novembre 2024'
    }
  ];

  const displayPayments = payments.length > 0 ? payments : samplePayments;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historique des paiements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getPaymentIcon(payment.method)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{payment.amount}€</span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(payment.date), 'dd MMMM yyyy', { locale: fr })} • {getPaymentMethodLabel(payment.method)}
                  </div>
                  {payment.reference && (
                    <div className="text-xs text-gray-500">
                      Réf: {payment.reference}
                    </div>
                  )}
                  {payment.description && (
                    <div className="text-xs text-gray-500">
                      {payment.description}
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownloadReceipt(payment)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Quittance
              </Button>
            </div>
          ))}
          
          {displayPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun paiement enregistré</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryCard;