
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  Wrench, 
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de Bord', href: '/', icon: Home },
  { name: 'Biens Immobiliers', href: '/properties', icon: Building2 },
  { name: 'Locataires', href: '/tenants', icon: Users },
  { name: 'Contrats & Baux', href: '/contracts', icon: FileText },
  { name: 'Finances', href: '/finances', icon: DollarSign },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Rapports', href: '/reports', icon: BarChart3 },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <Building2 className="h-8 w-8 text-blue-400" />
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
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-700 p-4">
        <Link
          to="/settings"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Settings className="mr-3 h-5 w-5" />
          Paramètres
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
