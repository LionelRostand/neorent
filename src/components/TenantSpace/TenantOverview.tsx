
import React from 'react';
import { useTranslation } from 'react-i18next';
import WelcomeBanner from './WelcomeBanner';
import PropertyInfoCard from './PropertyInfoCard';
import PersonalInfoCard from './PersonalInfoCard';
import QuickActionsCard from './QuickActionsCard';

interface TenantOverviewProps {
  propertyData: any;
  tenantData: any;
}

const TenantOverview: React.FC<TenantOverviewProps> = ({
  propertyData,
  tenantData
}) => {
  const { t } = useTranslation();

  if (!propertyData || !tenantData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const isRoommate = tenantData.type === 'Colocataire';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <WelcomeBanner tenantData={tenantData} isRoommate={isRoommate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <PropertyInfoCard propertyData={propertyData} isRoommate={isRoommate} />

        {/* Personal Information */}
        <PersonalInfoCard tenantData={tenantData} isRoommate={isRoommate} />
      </div>

      {/* Quick Actions */}
      <QuickActionsCard />
    </div>
  );
};

export default TenantOverview;
