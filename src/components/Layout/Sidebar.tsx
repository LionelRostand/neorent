
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  Settings,
  UserCheck,
  ClipboardList,
  Calculator,
  CreditCard,
  Receipt,
  Globe,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Tableau de Bord', href: '/admin', icon: Home },
  { name: 'Biens Immobiliers', href: '/admin/properties', icon: Building2 },
  { name: 'Locataires', href: '/admin/tenants', icon: Users },
  { name: 'Colocataires', href: '/admin/roommates', icon: UserCheck },
  { name: 'Contrats de Baux', href: '/admin/contracts', icon: FileText },
  { name: 'Etat des lieux', href: '/admin/inspections', icon: ClipboardList },
  { name: 'Gestion Loyer', href: '/admin/rent-management', icon: CreditCard },
  { name: 'Charges locatives', href: '/admin/rental-charges', icon: Receipt },
  { name: 'Fiscalités', href: '/admin/taxes', icon: Calculator },
  { name: 'Website', href: '/admin/website', icon: Globe },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle, onMobileClose }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "flex h-screen flex-col bg-green-600 shadow-lg transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 bg-green-700">
        {!isCollapsed && (
          <>
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-white" />
              <span className="ml-3 text-xl font-bold text-white">Neo Rent</span>
            </div>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileClose}
              className="lg:hidden text-white hover:bg-green-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        {isCollapsed && (
          <Building2 className="h-8 w-8 text-white mx-auto" />
        )}
      </div>

      {/* Toggle button for desktop */}
      <div className="hidden lg:block absolute -right-3 top-20 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="h-6 w-6 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onMobileClose}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-green-800 text-white shadow-sm'
                  : 'text-white hover:bg-green-700',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "h-5 w-5 text-white",
                isCollapsed ? "mx-auto" : "mr-3"
              )} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-green-500 p-4 space-y-2">
        <Link
          to="/admin/settings"
          onClick={onMobileClose}
          className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium text-white rounded-lg hover:bg-green-700 transition-colors",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Paramètres" : undefined}
        >
          <Settings className={cn(
            "h-5 w-5 text-white",
            isCollapsed ? "mx-auto" : "mr-3"
          )} />
          {!isCollapsed && <span>Paramètres</span>}
        </Link>
        
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs text-green-200">
            Neotech-Consulting 2025
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
