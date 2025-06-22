
import React from 'react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
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
  const { properties = [] } = useFirebaseProperties();
  const { roommates = [] } = useFirebaseRoommates();
  const { tenants = [] } = useFirebaseTenants();
  const { payments = [] } = useFirebasePayments();
  const { contracts = [] } = useFirebaseContracts();
  const { inspections = [] } = useFirebaseInspections();

  // Calculate owner properties
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  // Get property titles owned by this owner
  const ownerPropertyTitles = ownerProperties.map(p => p.title);

  // Filter roommates and tenants for owner properties only
  const ownerRoommates = roommates.filter(roommate => 
    ownerPropertyTitles.includes(roommate.property)
  );

  const ownerTenants = tenants.filter(tenant => 
    ownerPropertyTitles.includes(tenant.property)
  );

  const getMetricsForView = () => {
    switch (activeView) {
      case 'property':
        return usePropertyMetrics({ ownerProperties });
      case 'contract':
        return useContractMetrics({ contracts });
      case 'roommate':
        return useRoommateMetrics({ ownerRoommates, ownerProperties });
      case 'inspection':
        return useInspectionMetrics({ inspections });
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
