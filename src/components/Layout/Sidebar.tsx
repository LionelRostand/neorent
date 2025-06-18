
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
  MessageCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { EmployeePermissions } from '@/components/Settings/types/permissions';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onMobileClose }) => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const { canAccessMenu, isAdmin } = useUserPermissions();

  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      permission: 'dashboard' as keyof EmployeePermissions
    },
    { 
      icon: Building, 
      label: 'Propriétés', 
      path: '/admin/properties',
      permission: 'properties' as keyof EmployeePermissions
    },
    { 
      icon: Users, 
      label: 'Locataires', 
      path: '/admin/tenants',
      permission: 'tenants' as keyof EmployeePermissions
    },
    { 
      icon: UserCheck, 
      label: 'Colocataires', 
      path: '/admin/roommates',
      permission: 'roommates' as keyof EmployeePermissions
    },
    { 
      icon: FileText, 
      label: 'Contrats', 
      path: '/admin/contracts',
      permission: 'contracts' as keyof EmployeePermissions
    },
    { 
      icon: ClipboardList, 
      label: 'États des lieux', 
      path: '/admin/inspections',
      permission: 'inspections' as keyof EmployeePermissions
    },
    { 
      icon: DollarSign, 
      label: 'Gestion des loyers', 
      path: '/admin/rent-management',
      permission: 'rentManagement' as keyof EmployeePermissions
    },
    { 
      icon: Calculator, 
      label: 'Charges locatives', 
      path: '/admin/rental-charges',
      permission: 'rentalCharges' as keyof EmployeePermissions
    },
    { 
      icon: TrendingUp, 
      label: 'Prévisions', 
      path: '/admin/forecasting',
      permission: 'dashboard' as keyof EmployeePermissions
    },
    { 
      icon: Wrench, 
      label: 'Maintenance', 
      path: '/admin/maintenance',
      permission: 'maintenance' as keyof EmployeePermissions
    },
    { 
      icon: MessageCircle, 
      label: 'Messages', 
      path: '/admin/messages',
      permission: 'messages' as keyof EmployeePermissions
    },
    { 
      icon: FileText, 
      label: 'Déclarations fiscales', 
      path: '/admin/taxes',
      permission: 'taxes' as keyof EmployeePermissions
    },
    { 
      icon: Globe, 
      label: 'Site Web', 
      path: '/admin/website',
      permission: 'website' as keyof EmployeePermissions
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      path: '/admin/settings',
      permission: 'settings' as keyof EmployeePermissions
    },
    { 
      icon: HelpCircle, 
      label: 'Aide', 
      path: '/admin/help',
      permission: 'dashboard' as keyof EmployeePermissions // Accessible à tous ceux qui ont accès au dashboard
    }
  ];

  // Filtrer les éléments du menu selon les permissions
  const filteredMenuItems = menuItems.filter(item => {
    // Les admins voient tout
    if (isAdmin) return true;
    // Vérifier les permissions pour les autres utilisateurs
    return canAccessMenu(item.permission);
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-green-500 w-64 h-screen flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">NeoRent</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="space-y-2 py-4 px-3">
            {filteredMenuItems.map((item) => {
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
            Version 1.0 • {currentYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
