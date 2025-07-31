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
  showNextMonths?: boolean;
}

const PaidRentsDisplay: React.FC<PaidRentsDisplayProps> = ({
  payments,
  selectedMonth,
  title,
  showPreviousMonths = false,
  showNextMonths = false
}) => {
  const { t } = useTranslation();

  // Filtrer les paiements payés selon le type d'affichage
  const filteredPaidPayments = payments.filter(payment => {
    if (payment.status !== 'Payé' || !payment.dueDate) return false;
    
    // Utiliser la dueDate (date d'échéance) plutôt que paymentDate pour le filtrage
    const dueDate = new Date(payment.dueDate);
    const selectedMonthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const selectedMonthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    if (showPreviousMonths) {
      // Afficher les paiements dus avant le mois sélectionné
      return dueDate < selectedMonthStart;
    } else if (showNextMonths) {
      // Afficher les paiements dus après le mois sélectionné
      return dueDate > selectedMonthEnd;
    } else {
      // Afficher les paiements dus pendant le mois sélectionné
      return dueDate >= selectedMonthStart && dueDate <= selectedMonthEnd;
    }
  });

  // Grouper les paiements par mois si on affiche les mois précédents
  const groupedPayments = showPreviousMonths 
    ? filteredPaidPayments.reduce((groups: Record<string, Payment[]>, payment) => {
        const dueDate = new Date(payment.dueDate);
        const monthKey = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
        
        console.log(`🗓️ Groupement: ${payment.tenantName} - dueDate: ${payment.dueDate} -> monthKey: ${monthKey}`);
        
        if (!groups[monthKey]) {
          groups[monthKey] = [];
        }
        groups[monthKey].push(payment);
        return groups;
      }, {})
    : { 'current': filteredPaidPayments };

  const totalPaidAmount = filteredPaidPayments.reduce((sum, payment) => {
    return sum + (payment.paidAmount || payment.contractRentAmount || payment.rentAmount || 0);
  }, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getPaymentMethodBadge = (method: string | null) => {
    const methodMap: Record<string, { label: string; variant: any }> = {
      'Virement': { label: t('rentManagement.bankTransfer'), variant: 'default' },
      'Chèque': { label: t('rentManagement.check'), variant: 'secondary' },
      'Espèces': { label: t('rentManagement.cash'), variant: 'outline' },
      'Prélèvement': { label: t('rentManagement.automaticDebit'), variant: 'default' }
    };

    const paymentMethod = methodMap[method || ''] || { label: method || t('common.notSpecified'), variant: 'outline' };
    
    return (
      <Badge variant={paymentMethod.variant} className="text-xs">
        {paymentMethod.label}
      </Badge>
    );
  };

  const renderPaymentCard = (payment: Payment) => (
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
              <span className="text-sm text-gray-600">{t('rentManagement.amountPaid')}:</span>
              <span className="font-semibold text-green-600">
                {(payment.paidAmount || payment.contractRentAmount || payment.rentAmount)?.toLocaleString()}€
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('rentManagement.paymentDate')}:</span>
              <span className="text-sm text-gray-900">
                {payment.paymentDate ? formatDate(payment.paymentDate) : t('common.notSpecified')}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('rentManagement.paymentMethod')}:</span>
              {getPaymentMethodBadge(payment.paymentMethod)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            {t('rentManagement.totalReceived')}: {totalPaidAmount.toLocaleString()}€
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {filteredPaidPayments.length} {t('rentManagement.paidPayments').toLowerCase()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPaidPayments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('rentManagement.noPayments')}
            </h3>
            <p className="mt-2 text-gray-500">
              {showPreviousMonths 
                ? "Aucun paiement trouvé pour les mois précédents."
                : showNextMonths 
                  ? "Aucun paiement trouvé pour les mois suivants."
                  : t('rentManagement.noPaymentsDescription')
              }
            </p>
          </div>
        ) : showPreviousMonths ? (
          // Affichage groupé par mois pour les mois précédents
          <div className="space-y-6">
            {Object.entries(groupedPayments)
              .sort(([keyA], [keyB]) => keyB.localeCompare(keyA)) // Tri décroissant par date
              .map(([monthKey, monthPayments]) => {
                const monthDate = new Date(monthKey + '-01');
                const monthLabel = monthDate.toLocaleDateString('fr-FR', { 
                  month: 'long', 
                  year: 'numeric' 
                });
                const monthTotal = monthPayments.reduce((sum, payment) => 
                  sum + (payment.paidAmount || payment.contractRentAmount || payment.rentAmount || 0), 0
                );

                return (
                  <div key={monthKey} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {monthLabel}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{monthPayments.length} paiement(s)</span>
                        <span className="font-semibold text-green-600">
                          {monthTotal.toLocaleString()}€
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthPayments.map(renderPaymentCard)}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // Affichage normal pour le mois sélectionné
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPaidPayments.map(renderPaymentCard)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaidRentsDisplay;