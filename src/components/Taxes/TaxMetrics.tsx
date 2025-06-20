
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, XCircle, Receipt } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface TaxMetricsProps {
  paidCount: number;
  todeclareCount: number;
  pendingCount: number;
  totalCount: number;
}

const TaxMetrics = ({ paidCount, todeclareCount, pendingCount, totalCount }: TaxMetricsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        title={t('taxes.paidTaxes')}
        value={paidCount}
        description={`${paidCount} ${t('taxes.taxPaid')}`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title={t('taxes.taxesToDeclare')}
        value={todeclareCount}
        description={`${todeclareCount} ${t('taxes.declarationToDo')}`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title={t('taxes.taxesToPay')}
        value={pendingCount}
        description={`${pendingCount} ${t('taxes.paymentToMake')}`}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title={t('taxes.totalTaxes')}
        value={totalCount}
        description={`${totalCount} ${t('taxes.totalObligation')}`}
        icon={Receipt}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default TaxMetrics;
