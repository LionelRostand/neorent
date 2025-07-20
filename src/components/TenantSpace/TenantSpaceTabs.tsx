
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

interface TenantSpaceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mockPropertyData: any;
  mockTenantData: any;
}

const TenantSpaceTabs = ({ activeTab, onTabChange, mockPropertyData, mockTenantData }: TenantSpaceTabsProps) => {
  const { t } = useTranslation();
  const { getCurrentUserType } = useAdminTenantAccess();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';
  const isTenant = currentUserType === 'locataire';

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
        <TabsTrigger value="overview">{t('tenantSpace.tabs.overview')}</TabsTrigger>
        <TabsTrigger value="history">{t('tenantSpace.tabs.history')}</TabsTrigger>
        <TabsTrigger value="documents">{t('tenantSpace.tabs.documents')}</TabsTrigger>
        <TabsTrigger value="upload">{t('tenantSpace.tabs.upload')}</TabsTrigger>
        {isRoommate && (
          <TabsTrigger value="contract">Contrat</TabsTrigger>
        )}
        {isTenant && (
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

      {isRoommate && (
        <TabsContent value="contract" className="mt-6">
          <RoommateContractView />
        </TabsContent>
      )}

      {isTenant && (
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
