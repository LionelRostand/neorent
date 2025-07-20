
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import TenantOverview from './TenantOverview';
import RentHistory from './RentHistory';
import DocumentsSection from './DocumentsSection';
import DocumentUpload from './DocumentUpload';
import RoommateContractView from './RoommateContractView';
import SignedContractsView from './SignedContractsView';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';

interface TenantSpaceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mockPropertyData: any;
  mockTenantData: any;
}

const TenantSpaceTabs = ({ activeTab, onTabChange, mockPropertyData, mockTenantData }: TenantSpaceTabsProps) => {
  const { t } = useTranslation();
  const { getCurrentUserType } = useAdminTenantAccess();
  const { currentType } = useTenantSpaceData();
  
  // Utiliser currentType de useTenantSpaceData qui prend en compte les colocataires
  const userType = currentType || getCurrentUserType();
  
  const isRoommate = userType === 'colocataire';
  const isTenant = userType === 'locataire';
  const isAdminOrOwner = userType === 'admin' || userType === 'owner';

  console.log('TenantSpaceTabs - userType (from currentType):', userType);
  console.log('TenantSpaceTabs - isRoommate:', isRoommate);
  console.log('TenantSpaceTabs - isTenant:', isTenant);
  console.log('TenantSpaceTabs - Should show contract tab:', isRoommate || isAdminOrOwner);
  console.log('TenantSpaceTabs - Should show contracts tab:', isTenant || isAdminOrOwner);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
        <TabsTrigger value="overview">{t('tenantSpace.tabs.overview')}</TabsTrigger>
        <TabsTrigger value="history">{t('tenantSpace.tabs.history')}</TabsTrigger>
        <TabsTrigger value="documents">{t('tenantSpace.tabs.documents')}</TabsTrigger>
        <TabsTrigger value="upload">{t('tenantSpace.tabs.upload')}</TabsTrigger>
        {/* Afficher l'onglet contrat pour les colocataires */}
        {(isRoommate || isAdminOrOwner) && (
          <TabsTrigger value="contract">Contrat</TabsTrigger>
        )}
        {/* Afficher l'onglet contrats pour les locataires principaux */}
        {(isTenant || isAdminOrOwner) && (
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
        )}
        <TabsTrigger value="profile">{t('tenantSpace.tabs.profile')}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <TenantOverview 
          propertyData={mockPropertyData}
          tenantData={mockTenantData}
          onTabChange={onTabChange}
        />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <RentHistory />
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <DocumentsSection />
      </TabsContent>

      <TabsContent value="upload" className="mt-6">
        <DocumentUpload />
      </TabsContent>

      {/* Contenu du contrat pour colocataires */}
      {(isRoommate || isAdminOrOwner) && (
        <TabsContent value="contract" className="mt-6">
          <RoommateContractView />
        </TabsContent>
      )}

      {/* Contenu des contrats pour locataires principaux */}
      {(isTenant || isAdminOrOwner) && (
        <TabsContent value="contracts" className="mt-6">
          <SignedContractsView />
        </TabsContent>
      )}

      <TabsContent value="profile" className="mt-6">
        <TenantOverview 
          propertyData={mockPropertyData}
          tenantData={mockTenantData}
          activeView="profile"
        />
      </TabsContent>
    </Tabs>
  );
};

export default TenantSpaceTabs;
