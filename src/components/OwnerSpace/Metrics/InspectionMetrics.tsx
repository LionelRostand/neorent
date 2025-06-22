
import { CheckCircle, Calendar, AlertTriangle } from 'lucide-react';

interface InspectionMetricsProps {
  inspections: any[];
}

export const useInspectionMetrics = ({ inspections }: InspectionMetricsProps) => {
  const totalInspections = inspections.length;
  const completedInspections = inspections.filter(i => i.status === 'Completed').length;
  const pendingInspections = inspections.filter(i => i.status === 'Scheduled').length;
  const thisMonthInspections = inspections.filter(i => {
    if (!i.date) return false;
    const inspectionDate = new Date(i.date);
    const now = new Date();
    return inspectionDate.getMonth() === now.getMonth() && inspectionDate.getFullYear() === now.getFullYear();
  }).length;

  return [
    {
      title: 'Total Inspections',
      value: totalInspections,
      description: `${totalInspections} total inspections`,
      icon: CheckCircle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: completedInspections,
      description: `${completedInspections} completed inspections`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Scheduled',
      value: pendingInspections,
      description: `${pendingInspections} planned inspections`,
      icon: Calendar,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'This Month',
      value: thisMonthInspections,
      description: `${thisMonthInspections} inspections this month`,
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];
};
