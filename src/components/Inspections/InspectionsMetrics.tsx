
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, XCircle, FileCheck } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface InspectionsMetricsProps {
  completedCount: number;
  inProgressCount: number;
  plannedCount: number;
  totalCount: number;
}

const InspectionsMetrics = ({ 
  completedCount, 
  inProgressCount, 
  plannedCount, 
  totalCount 
}: InspectionsMetricsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={t('inspections.completed')}
        value={completedCount}
        description={t('inspections.completedInspections')}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title={t('inspections.inProgress')}
        value={inProgressCount}
        description={t('inspections.inProgressInspections')}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title={t('inspections.planned')}
        value={plannedCount}
        description={t('inspections.plannedInspections')}
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title={t('common.total')}
        value={totalCount}
        description={t('inspections.totalInspections')}
        icon={FileCheck}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default InspectionsMetrics;
