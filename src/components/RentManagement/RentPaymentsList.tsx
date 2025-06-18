
import React from 'react';
import { DollarSign } from 'lucide-react';
import RentPaymentCard from './RentPaymentCard';
import PaymentAlert from './PaymentAlert';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface RentPaymentsListProps {
  payments: Payment[];
  onMarkAsPaid: (paymentId: string) => void;
  onDeletePayment: (paymentId: string) => void;
}

const RentPaymentsList: React.FC<RentPaymentsListProps> = ({
  payments,
  onMarkAsPaid,
  onDeletePayment
}) => {
  // Filtrer les paiements avec des incohérences (pour la démo, on simule des montants payés différents)
  const paymentsWithDiscrepancies = payments.filter(payment => {
    // Simuler des montants payés différents pour certains paiements
    const paidAmount = payment.status === 'Payé' ? payment.rentAmount : 
                     payment.id.endsWith('1') ? payment.rentAmount - 200 :
                     payment.id.endsWith('2') ? payment.rentAmount + 100 : 
                     payment.rentAmount;
    return paidAmount !== payment.rentAmount && payment.status === 'Payé';
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          Statut des Paiements - Janvier 2025
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Vue d'ensemble des paiements de loyers</p>
      </div>

      {/* Alertes pour les incohérences de paiement */}
      {paymentsWithDiscrepancies.length > 0 && (
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-3">⚠️ Alertes de paiement</h3>
          <div className="space-y-3">
            {paymentsWithDiscrepancies.map((payment) => {
              const paidAmount = payment.id.endsWith('1') ? payment.rentAmount - 200 :
                               payment.id.endsWith('2') ? payment.rentAmount + 100 : 
                               payment.rentAmount;
              return (
                <PaymentAlert
                  key={`alert-${payment.id}`}
                  expectedAmount={payment.rentAmount}
                  paidAmount={paidAmount}
                  tenantName={payment.tenantName}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="p-3 sm:p-4 lg:p-6">
        {payments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <DollarSign className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">Aucun paiement</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500">Les paiements de loyers apparaîtront ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {payments.map((payment) => (
              <RentPaymentCard
                key={payment.id}
                payment={payment}
                onMarkAsPaid={onMarkAsPaid}
                onDelete={onDeletePayment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentPaymentsList;
