
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Building, 
  FileText, 
  Users, 
  ClipboardList,
  Calculator,
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OwnerSpaceQuickActionsSidebarProps {
  ownerProfile: any;
  activeView: string;
  setActiveView: (view: string) => void;
}

const OwnerSpaceQuickActionsSidebar: React.FC<OwnerSpaceQuickActionsSidebarProps> = ({
  ownerProfile,
  activeView,
  setActiveView
}) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600'
    },
    {
      id: 'property',
      label: 'Properties',
      icon: Building,
      color: 'text-green-600'
    },
    {
      id: 'contract',
      label: 'Contracts',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 'roommate',
      label: 'Roommates',
      icon: Users,
      color: 'text-orange-600'
    },
    {
      id: 'inspection',
      label: 'Inspections',
      icon: ClipboardList,
      color: 'text-red-600'
    },
    {
      id: 'charges',
      label: 'Rental Charges',
      icon: Calculator,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Owner Management
        </h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`
                  w-full justify-start h-auto p-3 
                  ${isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
                `}
                onClick={() => setActiveView(item.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color}`} />
                    <span className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-blue-600" />}
                </div>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default OwnerSpaceQuickActionsSidebar;
