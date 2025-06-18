
import React from 'react';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

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

interface NewRentMetricsProps {
  payments: Payment[];
}

const NewRentMetrics: React.FC<NewRentMetricsProps> = ({ payments }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric' 
  });

  // Calculs basés EXCLUSIVEMENT sur contractRentAmount
  const totalExpectedFromContracts = payments.reduce((sum, payment) => {
    const contractAmount = payment.contractRentAmount || payment.rentAmount;
    console.log(`💰 ${payment.tenantName}: ${contractAmount}€ (contrat)`);
    return sum + (Number(contractAmount) || 0);
  }, 0);

  const paidPayments = payments.filter(p => p.status === 'Payé');
  const latePayments = payments.filter(p => p.status === 'En retard');
  const pendingPayments = payments.filter(p => p.status === 'En attente');

  const totalReceived = paidPayments.reduce((sum, payment) => {
    const receivedAmount = payment.paidAmount || payment.contractRentAmount || payment.rentAmount;
    return sum + (Number(receivedAmount) || 0);
  }, 0);

  const totalLate = latePayments.reduce((sum, payment) => {
    const contractAmount = payment.contractRentAmount || payment.rentAmount;
    return sum + (Number(contractAmount) || 0);
  }, 0);

  const totalPending = pendingPayments.reduce((sum, payment) => {
    const contractAmount = payment.contractRentAmount || payment.rentAmount;
    return sum + (Number(contractAmount) || 0);
  }, 0);

  const remainingToReceive = totalExpectedFromContracts - totalReceived;

  console.log('📊 NOUVEAU CALCUL DES MÉTRIQUES:', {
    'Total attendu (contrats)': totalExpectedFromContracts,
    'Total reçu': totalReceived,
    'En retard': totalLate,
    'En attente': totalPending,
    'Reste à recevoir': remainingToReceive,
    'Mois': currentMonth
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Loyers Payés"
        value={paidPayments.length}
        description={`${totalReceived.toLocaleString()}€ reçus`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      
      <MetricCard
        title="En Retard"
        value={latePayments.length}
        description={`${totalLate.toLocaleString()}€ en retard`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      
      <MetricCard
        title="En Attente"
        value={pendingPayments.length}
        description={`${totalPending.toLocaleString()}€ attendus`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      
      <MetricCard
        title={`Total ${currentMonth}`}
        value={`${totalExpectedFromContracts.toLocaleString()}€`}
        description={`Reçu: ${totalReceived.toLocaleString()}€ | Manque: ${remainingToReceive.toLocaleString()}€`}
        icon={DollarSign}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default NewRentMetrics;
