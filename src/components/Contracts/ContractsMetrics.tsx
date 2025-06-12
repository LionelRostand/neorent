
import React from 'react';
import { CheckCircle, Clock, XCircle, ScrollText } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface ContractsMetricsProps {
  activeCount: number;
  expiredCount: number;
  totalCount: number;
}

const ContractsMetrics = ({ activeCount, expiredCount, totalCount }: ContractsMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Contrats actifs"
        value={activeCount}
        description={`${activeCount} contrat${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="À renouveler"
        value={0}
        description="0 contrat à renouveler"
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title="Expirés"
        value={expiredCount}
        description={`${expiredCount} contrat${expiredCount > 1 ? 's' : ''} expiré${expiredCount > 1 ? 's' : ''}`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title="Total"
        value={totalCount}
        description={`${totalCount} contrat${totalCount > 1 ? 's' : ''} au total`}
        icon={ScrollText}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default ContractsMetrics;
