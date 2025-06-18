
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
  
  // Calculer le total mensuel attendu à partir des PAIEMENTS ACTUELS (qui incluent déjà les contrats)
  const totalExpectedAmount = payments.reduce((sum, payment) => {
    // Utiliser le contractRentAmount s'il existe, sinon rentAmount
    const expectedAmount = payment.contractRentAmount || payment.rentAmount;
    return sum + (Number(expectedAmount) || 0);
  }, 0);

  // Calculer le total des paiements reçus ce mois
  const totalPaidAmount = payments
    .filter(p => p.status === 'Payé')
    .reduce((sum, payment) => {
      const actualPaidAmount = payment.paidAmount !== undefined ? payment.paidAmount : (payment.contractRentAmount || payment.rentAmount);
      return sum + (Number(actualPaidAmount) || 0);
    }, 0);

  console.log('💰 Calcul des métriques CORRIGÉ:', {
    totalExpectedAmount,
    totalPaidAmount,
    currentMonth,
    payments: payments.map(p => ({ 
      id: p.id, 
      nom: p.tenantName,
      rentAmount: p.rentAmount, 
      contractRentAmount: p.contractRentAmount,
      montantUtilisé: p.contractRentAmount || p.rentAmount,
      paidAmount: p.paidAmount, 
      status: p.status 
    }))
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Loyers Payés"
        value={paidCount}
        description={`${paidCount} paiement${paidCount > 1 ? 's' : ''} reçu${paidCount > 1 ? 's' : ''}`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="En Retard"
        value={lateCount}
        description={`${lateCount} paiement${lateCount > 1 ? 's' : ''} en retard`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title="En Attente"
        value={pendingCount}
        description={`${pendingCount} paiement${pendingCount > 1 ? 's' : ''} attendu${pendingCount > 1 ? 's' : ''}`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title={`Total ${currentMonth}`}
        value={`${totalExpectedAmount.toLocaleString()}€`}
        description={`Attendu: ${totalExpectedAmount.toLocaleString()}€ | Reçu: ${totalPaidAmount.toLocaleString()}€`}
        icon={DollarSign}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default RentMetrics;
