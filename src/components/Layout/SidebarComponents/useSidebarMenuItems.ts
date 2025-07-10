
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
import { useTranslation } from 'react-i18next';

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: any;
}

export const useSidebarMenuItems = (): SidebarMenuItem[] => {
  const { t } = useTranslation();

  return [
    {
      label: t('navigation.dashboard'),
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: t('navigation.properties'),
      path: '/admin/properties',
      icon: Building2
    },
    {
      label: t('navigation.tenants'),
      path: '/admin/tenants',
      icon: Users
    },
    {
      label: t('navigation.roommates'),
      path: '/admin/roommates',
      icon: UserPlus
    },
    {
      label: t('navigation.contracts'),
      path: '/admin/contracts',
      icon: FileText
    },
    {
      label: t('navigation.inspections'),
      path: '/admin/inspections',
      icon: ClipboardCheck
    },
    {
      label: t('navigation.rentManagement'),
      path: '/admin/rent-management',
      icon: DollarSign
    },
    {
      label: t('navigation.rentalCharges'),
      path: '/admin/rental-charges',
      icon: Receipt
    },
    {
      label: t('navigation.forecasting'),
      path: '/admin/forecasting',
      icon: TrendingUp
    },
    {
      label: t('navigation.maintenance'),
      path: '/admin/maintenance',
      icon: Wrench
    },
    {
      label: t('navigation.messages'),
      path: '/admin/messages',
      icon: MessageSquare
    },
    {
      label: t('navigation.taxes'),
      path: '/admin/taxes',
      icon: Calculator
    },
    {
      label: t('navigation.website'),
      path: '/admin/website',
      icon: Globe
    },
    {
      label: t('navigation.settings'),
      path: '/admin/settings',
      icon: Settings
    },
    {
      label: t('navigation.help'),
      path: '/admin/help',
      icon: HelpCircle
    }
  ];
};
