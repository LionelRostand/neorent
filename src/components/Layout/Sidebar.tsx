
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
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-white shadow-lg border-r border-gray-200">
      <div className="flex h-16 items-center px-6 bg-green-500">
        <Building2 className="h-8 w-8 text-white" />
        <span className="ml-3 text-xl font-bold text-white">Neo Rent</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5",
                isActive ? "text-white" : "text-gray-500 group-hover:text-green-600"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Link
          to="/admin/settings"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
          Paramètres
        </Link>
        
        <div className="px-3 py-2 text-xs text-gray-500">
          Neotech-Consulting 2025
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
