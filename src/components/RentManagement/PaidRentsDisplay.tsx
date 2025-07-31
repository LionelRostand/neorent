import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  contractRentAmount?: number;
  paidAmount?: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface PaidRentsDisplayProps {
  payments: Payment[];
  selectedMonth: Date;
  title: string;
  showPreviousMonths?: boolean;
}

const PaidRentsDisplay: React.FC<PaidRentsDisplayProps> = ({
  payments,
  selectedMonth,
  title,
  showPreviousMonths = false
}) => {
  const { t } = useTranslation();

  // Filtrer les paiements payés selon le type d'affichage
  const filteredPaidPayments = payments.filter(payment => {
    if (payment.status !== 'Payé' || !payment.paymentDate) return false;
    
    const paymentDate = new Date(payment.paymentDate);
    
    if (showPreviousMonths) {
      // Afficher les paiements des mois précédents au mois sélectionné
      return paymentDate < new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    } else {
      // Afficher les paiements du mois sélectionné
      return paymentDate.getMonth() === selectedMonth.getMonth() && 
             paymentDate.getFullYear() === selectedMonth.getFullYear();
    }
  });

  const totalPaidAmount = filteredPaidPayments.reduce((sum, payment) => {
    return sum + (payment.paidAmount || payment.contractRentAmount || payment.rentAmount || 0);
  }, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getPaymentMethodBadge = (method: string | null) => {
    const methodMap: Record<string, { label: string; variant: any }> = {
      'Virement': { label: 'Virement', variant: 'default' },
      'Chèque': { label: 'Chèque', variant: 'secondary' },
      'Espèces': { label: 'Espèces', variant: 'outline' },
      'Prélèvement': { label: 'Prélèvement', variant: 'default' }
    };

    const paymentMethod = methodMap[method || ''] || { label: method || 'Non spécifié', variant: 'outline' };
    
    return (
      <Badge variant={paymentMethod.variant} className="text-xs">
        {paymentMethod.label}
      </Badge>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total: {totalPaidAmount.toLocaleString()}€
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {filteredPaidPayments.length} paiement(s)
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPaidPayments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Aucun loyer payé
            </h3>
            <p className="mt-2 text-gray-500">
              Aucun paiement enregistré pour ce mois.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPaidPayments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {payment.tenantName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {payment.property}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {payment.tenantType}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Montant payé:</span>
                        <span className="font-semibold text-green-600">
                          {(payment.paidAmount || payment.contractRentAmount || payment.rentAmount)?.toLocaleString()}€
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Date de paiement:</span>
                        <span className="text-sm text-gray-900">
                          {payment.paymentDate ? formatDate(payment.paymentDate) : 'Non spécifiée'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Méthode:</span>
                        {getPaymentMethodBadge(payment.paymentMethod)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaidRentsDisplay;