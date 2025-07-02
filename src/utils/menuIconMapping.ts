
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  UserPlus, 
  FileCheck, 
  ClipboardCheck, 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  Wrench, 
  MessageSquare, 
  Calculator, 
  Globe, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

export const menuIconMapping: Record<string, any> = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/properties': Building,
  '/admin/tenants': Users,
  '/admin/roommates': UserPlus,
  '/admin/contracts': FileCheck,
  '/admin/inspections': ClipboardCheck,
  '/admin/rent-management': DollarSign,
  '/admin/rental-charges': Receipt,
  '/admin/forecasting': TrendingUp,
  '/admin/maintenance': Wrench,
  '/admin/messages': MessageSquare,
  '/admin/taxes': Calculator,
  '/admin/website': Globe,
  '/admin/settings': Settings,
  '/admin/help': HelpCircle
};

export const getIconForPath = (path: string) => {
  return menuIconMapping[path] || Settings;
};

export const getIconNameForPath = (path: string): string => {
  const iconMap: Record<string, string> = {
    '/admin/dashboard': 'LayoutDashboard',
    '/admin/properties': 'Building',
    '/admin/tenants': 'Users',
    '/admin/roommates': 'UserPlus',
    '/admin/contracts': 'FileCheck',
    '/admin/inspections': 'ClipboardCheck',
    '/admin/rent-management': 'DollarSign',
    '/admin/rental-charges': 'Receipt',
    '/admin/forecasting': 'TrendingUp',
    '/admin/maintenance': 'Wrench',
    '/admin/messages': 'MessageSquare',
    '/admin/taxes': 'Calculator',
    '/admin/website': 'Globe',
    '/admin/settings': 'Settings',
    '/admin/help': 'HelpCircle'
  };
  
  return iconMap[path] || 'Settings';
};
