
import React from 'react';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

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

interface RentMetricsProps {
  payments: Payment[];
}

const RentMetrics: React.FC<RentMetricsProps> = ({ payments }) => {
  const paidCount = payments.filter(p => p.status === 'Payé').length;
  const lateCount = payments.filter(p => p.status === 'En retard').length;
  const pendingCount = payments.filter(p => p.status === 'En attente').length;
  const totalAmount = payments.reduce((sum, p) => sum + p.rentAmount, 0);

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
        title="Total Mensuel"
        value={`${totalAmount}€`}
        description="Total des loyers mensuels"
        icon={DollarSign}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default RentMetrics;
