
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  CreditCard, 
  FileText, 
  MessageSquare
} from 'lucide-react';
import TenantOverview from './TenantOverview';
import RentHistory from './RentHistory';
import DocumentManager from '../DocumentManager';
import { ChatWidget } from '../Chat/ChatWidget';

interface TenantSpaceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  const [overviewView, setOverviewView] = useState<'overview' | 'profile'>('overview');

  const handleTabChange = (tab: string) => {
    if (tab === 'overview') {
      setOverviewView('overview');
    }
    onTabChange(tab);
  };

  const handleViewChange = (view: 'overview' | 'profile') => {
    setOverviewView(view);
    if (activeTab !== 'overview') {
      onTabChange('overview');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full min-w-fit grid-cols-4 gap-1 h-auto p-1 bg-gray-100">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">{t('tenantSpace.tabs.overview')}</span>
              <span className="sm:hidden font-medium">{t('common.overview')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">{t('tenantSpace.tabs.payment')}</span>
              <span className="sm:hidden font-medium">{t('common.payment')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">{t('tenantSpace.tabs.documents')}</span>
              <span className="sm:hidden font-medium">{t('common.documents')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">{t('common.messages')}</span>
              <span className="sm:hidden font-medium">{t('common.msg')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-[500px]">
          <TabsContent value="overview" className="mt-0">
            <TenantOverview 
              propertyData={mockPropertyData}
              tenantData={mockTenantData}
              onTabChange={onTabChange}
              activeView={overviewView}
              onViewChange={handleViewChange}
            />
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <RentHistory />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentManager 
              tenantId="tenant-1"
              tenantName={mockTenantData?.name || t('common.tenant')}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-xl">
              <div className="p-4 bg-blue-100 rounded-full mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('common.messages')}
              </h3>
              <p className="text-gray-600 max-w-md mb-6">
                {t('tenantSpace.messages.description')}
              </p>
              <ChatWidget />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TenantSpaceTabs;
