
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import TenantOverview from './TenantOverview';
import RentHistory from './RentHistory';
import DocumentsSection from './DocumentsSection';
import RoommateContractView from './RoommateContractView';
import SignedContractsView from './SignedContractsView';
import TenantChat from './TenantChat';
import TenantContacts from './TenantContacts';
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
  console.log('TenantSpaceTabs - Should show contract tab for all users:', true);
  console.log('TenantSpaceTabs - mockPropertyData:', mockPropertyData);
  console.log('TenantSpaceTabs - mockTenantData:', mockTenantData);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="overview">{t('tenantSpace.tabs.overview')}</TabsTrigger>
        <TabsTrigger value="history">{t('tenantSpace.tabs.history')}</TabsTrigger>
        <TabsTrigger value="documents">{t('tenantSpace.tabs.documents')}</TabsTrigger>
        {/* Onglet contrat pour tous les utilisateurs */}
        <TabsTrigger value="contract">{isRoommate ? 'Contrat' : 'Contrats'}</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="chat">{t('tenantSpace.tabs.chat')}</TabsTrigger>
        <TabsTrigger value="profile">{t('tenantSpace.tabs.profile')}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        {!mockPropertyData || !mockTenantData ? (
          <div className="p-8 text-center">
            <p className="text-red-600">ERREUR: Données manquantes</p>
            <p className="text-sm text-gray-500">mockPropertyData: {mockPropertyData ? 'OK' : 'MANQUANT'}</p>
            <p className="text-sm text-gray-500">mockTenantData: {mockTenantData ? 'OK' : 'MANQUANT'}</p>
          </div>
        ) : (
          <TenantOverview 
            propertyData={mockPropertyData}
            tenantData={mockTenantData}
            onTabChange={onTabChange}
          />
        )}
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <RentHistory />
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <DocumentsSection />
      </TabsContent>

      {/* Contenu des contrats adapté selon le type d'utilisateur */}
      <TabsContent value="contract" className="mt-6">
        {isRoommate ? <RoommateContractView /> : <SignedContractsView />}
      </TabsContent>

      <TabsContent value="contacts" className="mt-6">
        <TenantContacts currentProfile={mockTenantData} />
      </TabsContent>

      <TabsContent value="chat" className="mt-6">
        <TenantChat currentProfile={mockTenantData} />
      </TabsContent>

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
