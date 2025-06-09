
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
  Calculator
} from 'lucide-react';

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
    <div className="bg-green-500 w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">NeoRent</h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
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
        </div>
      </nav>

      <div className="p-4 border-t border-green-400">
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
