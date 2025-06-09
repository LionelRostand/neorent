
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  ClipboardList, 
  Wrench, 
  Settings, 
  UserCheck,
  Globe,
  Calculator,
  MessageCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onMobileClose }) => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: Building, 
      label: 'Propriétés', 
      path: '/admin/properties' 
    },
    { 
      icon: Users, 
      label: 'Locataires', 
      path: '/admin/tenants' 
    },
    { 
      icon: UserCheck, 
      label: 'Colocataires', 
      path: '/admin/roommates' 
    },
    { 
      icon: FileText, 
      label: 'Contrats', 
      path: '/admin/contracts' 
    },
    { 
      icon: ClipboardList, 
      label: 'États des lieux', 
      path: '/admin/inspections' 
    },
    { 
      icon: DollarSign, 
      label: 'Gestion des loyers', 
      path: '/admin/rent-management' 
    },
    { 
      icon: Calculator, 
      label: 'Charges locatives', 
      path: '/admin/rental-charges' 
    },
    { 
      icon: Wrench, 
      label: 'Maintenance', 
      path: '/admin/maintenance' 
    },
    { 
      icon: MessageCircle, 
      label: 'Messages', 
      path: '/admin/messages' 
    },
    { 
      icon: FileText, 
      label: 'Déclarations fiscales', 
      path: '/admin/taxes' 
    },
    { 
      icon: Globe, 
      label: 'Site Web', 
      path: '/admin/website' 
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      path: '/admin/settings' 
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-green-500 w-64 h-screen flex flex-col">
      <div className="p-6 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">NeoRent</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="space-y-2 py-4 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-green-400 text-white'
                      : 'text-white/90 hover:text-white hover:bg-green-400/50'
                  }`}
                  onClick={onMobileClose}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-green-400 flex-shrink-0">
        <div className="text-center">
          <div className="text-white text-sm font-medium animate-pulse">
            NEOTECH-CONSULTING
          </div>
          <div className="text-white/80 text-xs mt-1">
            {currentYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
