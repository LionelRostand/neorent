
import React from 'react';
import { DollarSign, Calculator, Building2, Receipt } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface ChargeMetricsProps {
  totalCharges: number;
  averageCharges: number;
  propertiesCount: number;
  highestCharge: number;
}

const ChargeMetrics: React.FC<ChargeMetricsProps> = ({
  totalCharges,
  averageCharges,
  propertiesCount,
  highestCharge
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total des charges"
        value={`${totalCharges.toFixed(2)}€`}
        description={`Pour ${propertiesCount} bien${propertiesCount > 1 ? 's' : ''}`}
        icon={DollarSign}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="Moyenne par bien"
        value={`${averageCharges.toFixed(2)}€`}
        description="Charges moyennes mensuelles"
        icon={Calculator}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
      <MetricCard
        title="Biens facturés"
        value={propertiesCount}
        description={`${propertiesCount} propriété${propertiesCount > 1 ? 's' : ''} ce mois`}
        icon={Building2}
        iconBgColor="bg-purple-500"
        borderColor="border-l-purple-500"
      />
      <MetricCard
        title="Charges max"
        value={`${highestCharge.toFixed(2)}€`}
        description="Bien avec le plus de charges"
        icon={Receipt}
        iconBgColor="bg-orange-500"
        borderColor="border-l-orange-500"
      />
    </div>
  );
};

export default ChargeMetrics;
