
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings,
  ArrowUpCircle
} from 'lucide-react';
import TenantOverview from './TenantOverview';
import RentHistory from './RentHistory';
import DocumentManager from '../DocumentManager';
import BankTransferDashboard from '../BankTransfer/BankTransferDashboard';

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
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
        <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Aperçu</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2 text-xs sm:text-sm">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Paiements</span>
        </TabsTrigger>
        <TabsTrigger value="transfers" className="flex items-center gap-2 text-xs sm:text-sm">
          <ArrowUpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Virements</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2 text-xs sm:text-sm">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Documents</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2 text-xs sm:text-sm">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2 text-xs sm:text-sm">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Paramètres</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <TenantOverview 
          propertyData={mockPropertyData}
          tenantData={mockTenantData}
        />
      </TabsContent>

      <TabsContent value="payments">
        <RentHistory />
      </TabsContent>

      <TabsContent value="transfers">
        <BankTransferDashboard />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentManager 
          tenantId="tenant-1"
          tenantName={mockTenantData?.name || "Locataire"}
        />
      </TabsContent>

      <TabsContent value="messages">
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Messages
          </h3>
          <p className="text-gray-500">
            Communiquez avec votre gestionnaire immobilier
          </p>
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <div className="text-center py-8">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Paramètres
          </h3>
          <p className="text-gray-500">
            Gérez vos préférences et informations personnelles
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TenantSpaceTabs;
