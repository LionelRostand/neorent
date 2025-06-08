
import React from 'react';
import { CheckCircle, Clock, XCircle, Building2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface Property {
  id: number;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
}

interface PropertyMetricsProps {
  properties: Property[];
}

const PropertyMetrics: React.FC<PropertyMetricsProps> = ({ properties }) => {
  const occupiedCount = properties.filter(p => p.status === 'Occupé').length;
  const availableCount = properties.filter(p => p.status === 'Libre').length;
  const totalCount = properties.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Biens occupés"
        value={occupiedCount}
        description={`${occupiedCount} bien${occupiedCount > 1 ? 's' : ''} occupé${occupiedCount > 1 ? 's' : ''}`}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="Biens libres"
        value={availableCount}
        description={`${availableCount} bien${availableCount > 1 ? 's' : ''} libre${availableCount > 1 ? 's' : ''}`}
        icon={Clock}
        iconBgColor="bg-yellow-500"
        borderColor="border-l-yellow-500"
      />
      <MetricCard
        title="En maintenance"
        value={0}
        description="0 bien en maintenance"
        icon={XCircle}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title="Total"
        value={totalCount}
        description={`${totalCount} bien${totalCount > 1 ? 's' : ''} au total`}
        icon={Building2}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
    </div>
  );
};

export default PropertyMetrics;
