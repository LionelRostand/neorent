
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
  paidAmount?: number;
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
  // Détection des incohérences de paiement - logique simplifiée et robuste
  const paymentsWithDiscrepancies = payments.filter(payment => {
    // Vérifier si un montant a été payé
    const hasPaidAmount = payment.paidAmount !== undefined && 
                         payment.paidAmount !== null && 
                         payment.paidAmount > 0;
    
    if (!hasPaidAmount) {
      return false; // Pas de paiement = pas d'incohérence à signaler
    }
    
    const expectedAmount = Number(payment.rentAmount) || 0;
    const actualPaidAmount = Number(payment.paidAmount) || 0;
    
    // Il y a incohérence si le montant payé est différent du montant attendu
    const hasDiscrepancy = actualPaidAmount !== expectedAmount;
    
    if (hasDiscrepancy) {
      console.log(`🚨 INCOHÉRENCE DÉTECTÉE: ${payment.tenantName}`, {
        attendu: expectedAmount,
        payé: actualPaidAmount,
        différence: expectedAmount - actualPaidAmount,
        statut: payment.status
      });
    }
    
    return hasDiscrepancy;
  });

  console.log(`📊 Total paiements: ${payments.length}, Incohérences: ${paymentsWithDiscrepancies.length}`);
  console.log('Paiements avec incohérences:', paymentsWithDiscrepancies.map(p => ({
    nom: p.tenantName,
    attendu: p.rentAmount,
    payé: p.paidAmount
  })));

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          Statut des Paiements - Janvier 2025
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Vue d'ensemble des paiements de loyers</p>
      </div>

      {/* Section d'alertes pour les incohérences - TOUJOURS visible s'il y en a */}
      {paymentsWithDiscrepancies.length > 0 && (
        <div className="p-4 lg:p-6 border-b border-red-200 bg-red-50">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-red-900 flex items-center">
              🚨 <span className="ml-2">Alertes de Paiement ({paymentsWithDiscrepancies.length})</span>
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Des incohérences de paiement ont été détectées
            </p>
          </div>
          <div className="space-y-3">
            {paymentsWithDiscrepancies.map((payment) => (
              <PaymentAlert
                key={`alert-${payment.id}`}
                expectedAmount={payment.rentAmount}
                paidAmount={payment.paidAmount || 0}
                tenantName={payment.tenantName}
                className="bg-white border-red-300"
              />
            ))}
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
