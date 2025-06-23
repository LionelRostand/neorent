
import React from 'react';
import { useOwnerData } from '@/hooks/useOwnerData';
import { usePropertyMetrics } from './Metrics/PropertyMetrics';
import { useContractMetrics } from './Metrics/ContractMetrics';
import { useRoommateMetrics } from './Metrics/RoommateMetrics';
import { useInspectionMetrics } from './Metrics/InspectionMetrics';
import MetricCard from './Metrics/MetricCard';

interface OwnerSpaceMetricsProps {
  ownerProfile: any;
  activeView: string;
}

const OwnerSpaceMetrics: React.FC<OwnerSpaceMetricsProps> = ({ ownerProfile, activeView }) => {
  const ownerData = useOwnerData(ownerProfile);

  const getMetricsForView = () => {
    switch (activeView) {
      case 'property':
        return usePropertyMetrics({ ownerProperties: ownerData.properties });
      case 'contract':
        return useContractMetrics({ contracts: ownerData.contracts });
      case 'roommate':
        return useRoommateMetrics({ 
          ownerRoommates: ownerData.roommates, 
          ownerProperties: ownerData.properties 
        });
      case 'inspection':
        return useInspectionMetrics({ inspections: ownerData.inspections });
      default:
        return [];
    }
  };

  const metrics = getMetricsForView();

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          iconColor={metric.iconColor}
          bgColor={metric.bgColor}
        />
      ))}
    </div>
  );
};

export default OwnerSpaceMetrics;
