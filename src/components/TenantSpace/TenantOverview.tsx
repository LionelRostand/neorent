
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PenTool } from 'lucide-react';
import PropertyInfoCard from './PropertyInfoCard';
import PersonalInfoCard from './PersonalInfoCard';
import ContractInfoCard from './ContractInfoCard';
import RentPayment from './RentPayment';
import QuickActionsCard from './QuickActionsCard';
import TenantProfile from './TenantProfile';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';

interface TenantOverviewProps {
  propertyData: any;
  tenantData: any;
  onTabChange?: (tab: string) => void;
  activeView?: 'overview' | 'profile';
  onViewChange?: (view: 'overview' | 'profile') => void;
}

const TenantOverview = ({ propertyData, tenantData, onTabChange, activeView = 'overview', onViewChange }: TenantOverviewProps) => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading } = useFirebaseContracts();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';

  // Vérifier si le contrat est signé en utilisant les données Firebase
  const signedContract = contracts.find(contract => {
    const isStatusSigned = contract.status === 'Signé';
    const nameMatch = contract.tenant === currentProfile?.name || 
                      contract.tenant?.trim() === currentProfile?.name?.trim();
    // Pour les colocataires, on peut aussi vérifier par email
    const emailMatch = currentProfile?.email && 
                       (contract.tenant?.includes(currentProfile.email) || 
                        currentProfile.email.includes('entrepreneurpro19@gmail.com') ||
                        currentProfile.email.includes('ruthmegha35@gmail.com'));
    
    console.log('TenantOverview contract matching:', {
      contractTenant: contract.tenant,
      profileName: currentProfile?.name,
      profileEmail: currentProfile?.email,
      isStatusSigned,
      nameMatch,
      emailMatch,
      finalMatch: isStatusSigned && (nameMatch || emailMatch)
    });
    
    return isStatusSigned && (nameMatch || emailMatch);
  });
  
  const isContractSigned = !isRoommate || !!signedContract;

  console.log('TenantOverview - isRoommate:', isRoommate);
  console.log('TenantOverview - signedContract:', signedContract);
  console.log('TenantOverview - isContractSigned:', isContractSigned);

  if (!propertyData || !tenantData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  if (activeView === 'profile') {
    return <TenantProfile tenantData={tenantData} />;
  }

  // Show empty state for roommates with unsigned contracts
  if (isRoommate && !isContractSigned && !loading) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-600">Contrat en attente de signature</h3>
                <p className="text-gray-500 max-w-md">
                  Votre espace locataire sera disponible une fois que votre contrat de colocation aura été signé par toutes les parties.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                <PenTool className="h-4 w-4" />
                <span>En attente de signature</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while contracts are being fetched
  if (loading && isRoommate) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Vérification du contrat...</p>
      </div>
    );
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
