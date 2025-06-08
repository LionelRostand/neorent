
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  FileText,
  ScrollText,
  ClipboardList,
  DollarSign,
  Receipt,
  Calculator,
  Globe,
  Settings,
  Home,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Biens Immobiliers', href: '/properties', icon: Building2 },
  { name: 'Locataires', href: '/tenants', icon: Users },
  { name: 'Colocataires', href: '/roommates', icon: UserCheck },
  { name: 'Contrats', href: '/contracts', icon: FileText },
  { name: 'Baux', href: '/leases', icon: ScrollText },
  { name: 'États des lieux', href: '/inspections', icon: ClipboardList },
  { name: 'Gestion des loyers', href: '/rent-management', icon: DollarSign },
  { name: 'Charges locatives', href: '/rental-charges', icon: Receipt },
  { name: 'Déclarations fiscales', href: '/taxes', icon: Calculator },
  { name: 'Site Web', href: '/website', icon: Globe },
  { name: 'Espace Locataire', href: '/tenant-space', icon: User },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <Home className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Neo Rent</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    isActive
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium border-l-4 transition-colors duration-200'
                  )
                }
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
