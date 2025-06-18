
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
  
  // CALCUL PRINCIPAL: Utiliser TOUJOURS contractRentAmount en priorité absolue
  const totalExpectedAmount = payments.reduce((sum, payment) => {
    // Si contractRentAmount existe, l'utiliser OBLIGATOIREMENT
    const expectedAmount = payment.contractRentAmount !== undefined && payment.contractRentAmount !== null 
      ? payment.contractRentAmount 
      : payment.rentAmount;
    
    console.log(`🎯 CALCUL POUR ${payment.tenantName}:`, {
      rentAmount: payment.rentAmount,
      contractRentAmount: payment.contractRentAmount,
      montantRetenu: expectedAmount,
      source: payment.contractRentAmount !== undefined ? 'CONTRAT' : 'ESTIMATION'
    });
    
    return sum + (Number(expectedAmount) || 0);
  }, 0);

  // Total des paiements effectivement reçus
  const totalPaidAmount = payments
    .filter(p => p.status === 'Payé')
    .reduce((sum, payment) => {
      const paidAmount = payment.paidAmount !== undefined && payment.paidAmount !== null 
        ? payment.paidAmount 
        : (payment.contractRentAmount || payment.rentAmount);
      return sum + (Number(paidAmount) || 0);
    }, 0);

  // Montant en retard (basé sur les contrats)
  const totalLateAmount = payments
    .filter(p => p.status === 'En retard')
    .reduce((sum, payment) => {
      const expectedAmount = payment.contractRentAmount !== undefined && payment.contractRentAmount !== null 
        ? payment.contractRentAmount 
        : payment.rentAmount;
      return sum + (Number(expectedAmount) || 0);
    }, 0);

  // Montant en attente (basé sur les contrats)
  const totalPendingAmount = payments
    .filter(p => p.status === 'En attente')
    .reduce((sum, payment) => {
      const expectedAmount = payment.contractRentAmount !== undefined && payment.contractRentAmount !== null 
        ? payment.contractRentAmount 
        : payment.rentAmount;
      return sum + (Number(expectedAmount) || 0);
    }, 0);

  // Ce qui reste à recevoir
  const totalMissingAmount = totalExpectedAmount - totalPaidAmount;

  console.log('📊 RÉSUMÉ FINAL DES MÉTRIQUES:', {
    'Total attendu (selon contrats)': totalExpectedAmount,
    'Total reçu': totalPaidAmount,
    'Montant en retard': totalLateAmount,
    'Montant en attente': totalPendingAmount,
    'Reste à recevoir': totalMissingAmount,
    'Période': currentMonth,
    'Détail par paiement': payments.map(p => ({
      locataire: p.tenantName,
      contrat: p.contractRentAmount,
      estimation: p.rentAmount,
      montantFinal: p.contractRentAmount !== undefined ? p.contractRentAmount : p.rentAmount,
      statut: p.status
    }))
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Loyers Payés"
        value={paidCount}
        description={`${totalPaidAmount.toLocaleString()}€ reçus sur ${totalExpectedAmount.toLocaleString()}€ attendus`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="En Retard"
        value={lateCount}
        description={`${totalLateAmount.toLocaleString()}€ dus (selon contrats de bail)`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title="En Attente"
        value={pendingCount}
        description={`${totalPendingAmount.toLocaleString()}€ attendus (selon contrats de bail)`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title={`Total ${currentMonth}`}
        value={`${totalExpectedAmount.toLocaleString()}€`}
        description={`Attendu: ${totalExpectedAmount.toLocaleString()}€ (contrats) | Reçu: ${totalPaidAmount.toLocaleString()}€ | Manque: ${totalMissingAmount.toLocaleString()}€`}
        icon={DollarSign}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default RentMetrics;
