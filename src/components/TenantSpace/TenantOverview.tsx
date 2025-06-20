
import React from 'react';
import PropertyInfoCard from './PropertyInfoCard';
import PersonalInfoCard from './PersonalInfoCard';
import ContractInfoCard from './ContractInfoCard';
import RentPayment from './RentPayment';
import QuickActionsCard from './QuickActionsCard';

interface TenantOverviewProps {
  propertyData: any;
  tenantData: any;
  onTabChange?: (tab: string) => void;
}

const TenantOverview = ({ propertyData, tenantData, onTabChange }: TenantOverviewProps) => {
  if (!propertyData || !tenantData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  const isRoommate = tenantData.type === 'Colocataire';

  return (
    <div className="space-y-6">
      {onTabChange && <QuickActionsCard onTabChange={onTabChange} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PropertyInfoCard 
            propertyData={propertyData}
            isRoommate={isRoommate}
          />
          <PersonalInfoCard tenantData={tenantData} />
        </div>
        
        <div className="space-y-6">
          <RentPayment 
            tenantData={tenantData}
            propertyData={propertyData}
          />
          <ContractInfoCard tenantData={tenantData} />
        </div>
      </div>
    </div>
  );
};

export default TenantOverview;
