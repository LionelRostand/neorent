
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, XCircle, ScrollText } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface ContractsMetricsProps {
  activeCount: number;
  expiredCount: number;
  totalCount: number;
}

const ContractsMetrics = ({ activeCount, expiredCount, totalCount }: ContractsMetricsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={t('contracts.activeContracts')}
        value={activeCount}
        description={`${activeCount} ${t('contracts.activeContractsCount')}`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title={t('contracts.toRenew')}
        value={0}
        description={`0 ${t('contracts.toRenewCount')}`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title={t('contracts.expired')}
        value={expiredCount}
        description={`${expiredCount} ${t('contracts.expiredCount')}`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title={t('contracts.total')}
        value={totalCount}
        description={`${totalCount} ${t('contracts.totalCount')}`}
        icon={ScrollText}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default ContractsMetrics;
