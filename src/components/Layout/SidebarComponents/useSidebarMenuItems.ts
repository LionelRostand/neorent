
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  UserCheck, 
  FileText, 
  ClipboardCheck, 
  Euro, 
  Receipt, 
  TrendingUp, 
  Settings, 
  Wrench, 
  MessageSquare, 
  Calculator, 
  Globe, 
  HelpCircle,
  Crown
} from 'lucide-react';

export const useSidebarMenuItems = () => {
  const { t } = useTranslation();

  return [
    {
      title: t('navigation.dashboard'),
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('navigation.properties'),
      url: '/admin/properties',
      icon: Building,
    },
    {
      title: t('navigation.tenants'),
      url: '/admin/tenants',
      icon: Users,
    },
    {
      title: t('navigation.roommates'),
      url: '/admin/roommates',
      icon: UserCheck,
    },
    {
      title: t('navigation.contracts'),
      url: '/admin/contracts',
      icon: FileText,
    },
    {
      title: t('navigation.inspections'),
      url: '/admin/inspections',
      icon: ClipboardCheck,
    },
    {
      title: t('navigation.rentManagement'),
      url: '/admin/rent-management',
      icon: Euro,
    },
    {
      title: t('navigation.rentalCharges'),
      url: '/admin/rental-charges',
      icon: Receipt,
    },
    {
      title: t('navigation.forecasting'),
      url: '/admin/forecasting',
      icon: TrendingUp,
    },
    {
      title: t('navigation.maintenance'),
      url: '/admin/maintenance',
      icon: Wrench,
    },
    {
      title: t('navigation.messages'),
      url: '/admin/messages',
      icon: MessageSquare,
    },
    {
      title: t('navigation.taxes'),
      url: '/admin/taxes',
      icon: Calculator,
    },
    {
      title: t('navigation.website'),
      url: '/admin/website',
      icon: Globe,
    },
    {
      title: 'Espaces Propriétaires',
      url: '/admin/owner-spaces',
      icon: Crown,
    },
    {
      title: t('navigation.settings'),
      url: '/admin/settings',
      icon: Settings,
    },
    {
      title: t('navigation.help'),
      url: '/admin/help',
      icon: HelpCircle,
    },
  ];
};
