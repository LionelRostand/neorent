
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserPlus, 
  FileText, 
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

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: any;
}

export const useSidebarMenuItems = (): SidebarMenuItem[] => {
  return [
    {
      label: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Propriétés',
      path: '/admin/properties',
      icon: Building2
    },
    {
      label: 'Locataires',
      path: '/admin/tenants',
      icon: Users
    },
    {
      label: 'Colocataires',
      path: '/admin/roommates',
      icon: UserPlus
    },
    {
      label: 'Contrats',
      path: '/admin/contracts',
      icon: FileText
    },
    {
      label: 'Inspections',
      path: '/admin/inspections',
      icon: ClipboardCheck
    },
    {
      label: 'Gestion des loyers',
      path: '/admin/rent-management',
      icon: DollarSign
    },
    {
      label: 'Charges locatives',
      path: '/admin/rental-charges',
      icon: Receipt
    },
    {
      label: 'Prévisions',
      path: '/admin/forecasting',
      icon: TrendingUp
    },
    {
      label: 'Maintenance',
      path: '/admin/maintenance',
      icon: Wrench
    },
    {
      label: 'Messages',
      path: '/admin/messages',
      icon: MessageSquare
    },
    {
      label: 'Fiscalité',
      path: '/admin/taxes',
      icon: Calculator
    },
    {
      label: 'Site web',
      path: '/admin/website',
      icon: Globe
    },
    {
      label: 'Paramètres',
      path: '/admin/settings',
      icon: Settings
    },
    {
      label: 'Aide',
      path: '/admin/help',
      icon: HelpCircle
    }
  ];
};
