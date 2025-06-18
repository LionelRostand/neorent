
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  CreditCard, 
  FileText, 
  User, 
  Upload
} from 'lucide-react';

import TenantProfile from './TenantProfile';
import PropertyInfo from './PropertyInfo';
import RentPayment from './RentPayment';
import RentHistory from './RentHistory';
import TenantDocuments from './TenantDocuments';
import DocumentUpload from './DocumentUpload';

interface TenantSpaceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  mockPropertyData: any;
  mockTenantData: any;
}

const TenantSpaceTabs: React.FC<TenantSpaceTabsProps> = ({
  activeTab,
  onTabChange,
  mockPropertyData,
  mockTenantData
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'overview', label: t('tenantSpace.tabs.overview'), icon: Home },
    { id: 'payment', label: t('tenantSpace.tabs.payment'), icon: CreditCard },
    { id: 'history', label: t('tenantSpace.tabs.history'), icon: FileText },
    { id: 'documents', label: t('tenantSpace.tabs.documents'), icon: FileText },
    { id: 'upload', label: t('tenantSpace.tabs.upload'), icon: Upload },
    { id: 'profile', label: t('tenantSpace.tabs.profile'), icon: User }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="grid w-full min-w-[600px] grid-cols-6 mb-4 md:mb-6 mx-1">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
            >
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate text-[10px] sm:text-xs lg:text-sm">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-4 md:space-y-6">
        <PropertyInfo propertyData={mockPropertyData} />
      </TabsContent>

      <TabsContent value="payment" className="space-y-4 md:space-y-6">
        <RentPayment tenantData={mockTenantData} propertyData={mockPropertyData} />
      </TabsContent>

      <TabsContent value="history" className="space-y-4 md:space-y-6">
        <RentHistory />
      </TabsContent>

      <TabsContent value="documents" className="space-y-4 md:space-y-6">
        <TenantDocuments />
      </TabsContent>

      <TabsContent value="upload" className="space-y-4 md:space-y-6">
        <DocumentUpload />
      </TabsContent>

      <TabsContent value="profile" className="space-y-4 md:space-y-6">
        <TenantProfile tenantData={mockTenantData} />
      </TabsContent>
    </Tabs>
  );
};

export default TenantSpaceTabs;
