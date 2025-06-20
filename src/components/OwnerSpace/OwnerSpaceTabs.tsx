
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Building, 
  Users, 
  UserCheck,
  FileText, 
  ClipboardList,
  DollarSign, 
  Calculator,
  TrendingUp,
  Wrench,
  MessageSquare,
  Receipt
} from 'lucide-react';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import Tenants from '@/pages/Tenants';
import Roommates from '@/pages/Roommates';
import Contracts from '@/pages/Contracts';
import Inspections from '@/pages/Inspections';
import RentManagement from '@/pages/RentManagement';
import RentalCharges from '@/pages/RentalCharges';
import Forecasting from '@/pages/Forecasting';
import Maintenance from '@/pages/Maintenance';
import Messages from '@/pages/Messages';
import Taxes from '@/pages/Taxes';

interface OwnerSpaceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  ownerProfile: any;
}

const OwnerSpaceTabs: React.FC<OwnerSpaceTabsProps> = ({
  activeTab,
  onTabChange,
  ownerProfile
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, component: Dashboard },
    { id: 'properties', label: 'Propriétés', icon: Building, component: Properties },
    { id: 'tenants', label: 'Locataires', icon: Users, component: Tenants },
    { id: 'roommates', label: 'Colocataires', icon: UserCheck, component: Roommates },
    { id: 'contracts', label: 'Contrats de bail', icon: FileText, component: Contracts },
    { id: 'inspections', label: 'États des lieux', icon: ClipboardList, component: Inspections },
    { id: 'rent', label: 'Gestion des loyers', icon: DollarSign, component: RentManagement },
    { id: 'charges', label: 'Charges locatives', icon: Calculator, component: RentalCharges },
    { id: 'forecasting', label: 'Prévisions financières', icon: TrendingUp, component: Forecasting },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, component: Maintenance },
    { id: 'messages', label: 'Messages', icon: MessageSquare, component: Messages },
    { id: 'taxes', label: 'Gestion fiscale', icon: Receipt, component: Taxes }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full min-w-fit grid-cols-6 lg:grid-cols-12 gap-1 h-auto p-1 bg-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 text-xs px-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline font-medium text-center">{tab.label}</span>
                  <span className="lg:hidden font-medium">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="min-h-[500px]">
          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="bg-white rounded-lg shadow-sm">
                  <Component />
                </div>
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
};

export default OwnerSpaceTabs;
