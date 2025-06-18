
import React from 'react';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

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

interface RentMetricsProps {
  payments: Payment[];
}

const RentMetrics: React.FC<RentMetricsProps> = ({ payments }) => {
  const { properties } = useFirebaseProperties();
  
  const paidCount = payments.filter(p => p.status === 'Payé').length;
  const lateCount = payments.filter(p => p.status === 'En retard').length;
  const pendingCount = payments.filter(p => p.status === 'En attente').length;
  
  // Obtenir le mois en cours en français
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric' 
  });
  
  // CALCUL CORRIGÉ: Toujours utiliser contractRentAmount s'il existe, sinon rentAmount
  const totalExpectedAmount = payments.reduce((sum, payment) => {
    // PRIORITÉ ABSOLUE au contractRentAmount
    const expectedAmount = payment.contractRentAmount || payment.rentAmount;
    
    console.log(`🔍 ${payment.tenantName}:`, {
      rentAmount: payment.rentAmount,
      contractRentAmount: payment.contractRentAmount,
      montantUtilisé: expectedAmount,
      status: payment.status
    });
    
    return sum + (Number(expectedAmount) || 0);
  }, 0);

  // Calculer le total des paiements reçus ce mois
  const totalPaidAmount = payments
    .filter(p => p.status === 'Payé')
    .reduce((sum, payment) => {
      const actualPaidAmount = payment.paidAmount !== undefined ? payment.paidAmount : (payment.contractRentAmount || payment.rentAmount);
      return sum + (Number(actualPaidAmount) || 0);
    }, 0);

  // Calculer le montant total en retard
  const totalLateAmount = payments
    .filter(p => p.status === 'En retard')
    .reduce((sum, payment) => {
      const expectedAmount = payment.contractRentAmount || payment.rentAmount;
      return sum + (Number(expectedAmount) || 0);
    }, 0);

  // Calculer le montant total en attente (différence entre attendu et reçu)
  const totalPendingAmount = payments
    .filter(p => p.status === 'En attente')
    .reduce((sum, payment) => {
      const expectedAmount = payment.contractRentAmount || payment.rentAmount;
      return sum + (Number(expectedAmount) || 0);
    }, 0);

  // Calculer la différence totale (ce qui manque encore)
  const totalMissingAmount = totalExpectedAmount - totalPaidAmount;

  console.log('🎯 DIAGNOSTIC COMPLET DES CONTRATS:', {
    totalExpectedAmount,
    totalPaidAmount,
    totalLateAmount,
    totalPendingAmount,
    totalMissingAmount,
    currentMonth,
    détailPaiements: payments.map(p => ({ 
      nom: p.tenantName,
      rentAmount: p.rentAmount, 
      contractRentAmount: p.contractRentAmount,
      montantFinalUtilisé: p.contractRentAmount || p.rentAmount,
      paidAmount: p.paidAmount, 
      status: p.status,
      propriété: p.property
    }))
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Loyers Payés"
        value={paidCount}
        description={`${totalPaidAmount.toLocaleString()}€ reçus (${paidCount} paiement${paidCount > 1 ? 's' : ''})`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="En Retard"
        value={lateCount}
        description={`${totalLateAmount.toLocaleString()}€ en retard (${lateCount} paiement${lateCount > 1 ? 's' : ''})`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title="En Attente"
        value={pendingCount}
        description={`${totalPendingAmount.toLocaleString()}€ manquants (${pendingCount} paiement${pendingCount > 1 ? 's' : ''})`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title={`Total ${currentMonth}`}
        value={`${totalExpectedAmount.toLocaleString()}€`}
        description={`Attendu: ${totalExpectedAmount.toLocaleString()}€ | Reçu: ${totalPaidAmount.toLocaleString()}€ | Reste: ${totalMissingAmount.toLocaleString()}€`}
        icon={DollarSign}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default RentMetrics;
