
import React from 'react';
import PropertyInfoCard from './PropertyInfoCard';
import PersonalInfoCard from './PersonalInfoCard';
import ContractInfoCard from './ContractInfoCard';
import RentPayment from './RentPayment';
import QuickActionsCard from './QuickActionsCard';
import TenantProfile from './TenantProfile';

interface TenantOverviewProps {
  propertyData: any;
  tenantData: any;
  onTabChange?: (tab: string) => void;
  activeView?: 'overview' | 'profile';
  onViewChange?: (view: 'overview' | 'profile') => void;
}

const TenantOverview = ({ propertyData, tenantData, onTabChange, activeView = 'overview', onViewChange }: TenantOverviewProps) => {
  if (!propertyData || !tenantData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  const isRoommate = tenantData.type === 'Colocataire';

  if (activeView === 'profile') {
    return <TenantProfile tenantData={tenantData} />;
  }

  // Create mock contract data based on tenant and property data
  const mockContractData = {
    tenant: tenantData.name,
    property: propertyData.address,
    amount: `${propertyData.rent}€`,
    startDate: tenantData.leaseStart || '2025-01-06',
    status: 'Actif'
  };

  const monthlyRent = propertyData.rent || 400;
  const monthlyCharges = propertyData.charges || 50;
  const totalMonthly = monthlyRent + monthlyCharges;

  return (
    <div className="space-y-6">
      {onTabChange && <QuickActionsCard onTabChange={onTabChange} onViewChange={onViewChange} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PropertyInfoCard 
            propertyData={propertyData}
            isRoommate={isRoommate}
          />
          <PersonalInfoCard 
            tenantData={tenantData}
            isRoommate={isRoommate}
          />
        </div>
        
        <div className="space-y-6">
          <RentPayment 
            tenantData={tenantData}
            propertyData={propertyData}
          />
          <ContractInfoCard 
            contractData={mockContractData}
            monthlyRent={monthlyRent}
            monthlyCharges={monthlyCharges}
            totalMonthly={totalMonthly}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantOverview;
