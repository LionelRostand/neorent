
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
      label: t('navigation.dashboard', 'Tableau de bord'),
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: t('navigation.properties', 'Propriétés'),
      path: '/admin/properties',
      icon: Building2
    },
    {
      label: t('navigation.tenants', 'Locataires'),
      path: '/admin/tenants',
      icon: Users
    },
    {
      label: t('navigation.roommates', 'Colocataires'),
      path: '/admin/roommates',
      icon: UserPlus
    },
    {
      label: t('navigation.contracts', 'Contrats'),
      path: '/admin/contracts',
      icon: FileText
    },
    {
      label: t('navigation.inspections', 'Inspections'),
      path: '/admin/inspections',
      icon: ClipboardCheck
    },
    {
      label: t('navigation.rentManagement', 'Gestion des loyers'),
      path: '/admin/rent-management',
      icon: DollarSign
    },
    {
      label: t('navigation.rentalCharges', 'Charges locatives'),
      path: '/admin/rental-charges',
      icon: Receipt
    },
    {
      label: t('navigation.forecasting', 'Prévisions'),
      path: '/admin/forecasting',
      icon: TrendingUp
    },
    {
      label: t('navigation.maintenance', 'Maintenance'),
      path: '/admin/maintenance',
      icon: Wrench
    },
    {
      label: t('navigation.messages', 'Messages'),
      path: '/admin/messages',
      icon: MessageSquare
    },
    {
      label: t('navigation.taxes', 'Fiscalité'),
      path: '/admin/taxes',
      icon: Calculator
    },
    {
      label: t('navigation.website', 'Site web'),
      path: '/admin/website',
      icon: Globe
    },
    {
      label: t('navigation.settings', 'Paramètres'),
      path: '/admin/settings',
      icon: Settings
    },
    {
      label: t('navigation.help', 'Aide'),
      path: '/admin/help',
      icon: HelpCircle
    }
  ];
};
