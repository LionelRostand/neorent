
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings
} from 'lucide-react';
import TenantOverview from './TenantOverview';
import RentHistory from './RentHistory';
import DocumentManager from '../DocumentManager';
import TenantSecuritySettings from './TenantSecuritySettings';

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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full min-w-fit grid-cols-5 gap-1 h-auto p-1 bg-gray-100">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Aperçu</span>
              <span className="sm:hidden font-medium">Vue</span>
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Paiements</span>
              <span className="sm:hidden font-medium">Pay.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Documents</span>
              <span className="sm:hidden font-medium">Doc.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Messages</span>
              <span className="sm:hidden font-medium">Msg.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 text-xs sm:text-sm px-3 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Paramètres</span>
              <span className="sm:hidden font-medium">Set.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-[500px]">
          <TabsContent value="overview" className="mt-0">
            <TenantOverview 
              propertyData={mockPropertyData}
              tenantData={mockTenantData}
            />
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <RentHistory />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentManager 
              tenantId="tenant-1"
              tenantName={mockTenantData?.name || "Locataire"}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-xl">
              <div className="p-4 bg-blue-100 rounded-full mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Messages
              </h3>
              <p className="text-gray-600 max-w-md">
                Communiquez avec votre gestionnaire immobilier et recevez des notifications importantes
              </p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouveau message
              </button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <TenantSecuritySettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TenantSpaceTabs;
