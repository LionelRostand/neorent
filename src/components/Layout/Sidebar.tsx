
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
    <div className="bg-green-50 border-r border-green-200 w-64 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-green-800">NeoRent</h1>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
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
    </div>
  );
};

export default Sidebar;
