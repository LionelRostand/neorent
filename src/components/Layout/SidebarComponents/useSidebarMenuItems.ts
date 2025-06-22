
import { useTranslation } from 'react-i18next';
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
import { EmployeePermissions } from '@/components/Settings/types/permissions';

export const useSidebarMenuItems = () => {
  const { t } = useTranslation();

  return [
    { 
      icon: Home, 
      label: t('navigation.dashboard'), 
      path: '/admin/dashboard',
      permission: 'dashboard' as keyof EmployeePermissions
    },
    { 
      icon: Building, 
      label: t('navigation.properties'), 
      path: '/admin/properties',
      permission: 'properties' as keyof EmployeePermissions
    },
    { 
      icon: Users, 
      label: t('navigation.tenants'), 
      path: '/admin/tenants',
      permission: 'tenants' as keyof EmployeePermissions
    },
    { 
      icon: UserCheck, 
      label: t('navigation.roommates'), 
      path: '/admin/roommates',
      permission: 'roommates' as keyof EmployeePermissions
    },
    { 
      icon: FileText, 
      label: t('navigation.contracts'), 
      path: '/admin/contracts',
      permission: 'contracts' as keyof EmployeePermissions
    },
    { 
      icon: ClipboardList, 
      label: t('navigation.inspections'), 
      path: '/admin/inspections',
      permission: 'inspections' as keyof EmployeePermissions
    },
    { 
      icon: DollarSign, 
      label: t('navigation.rentManagement'), 
      path: '/admin/rent-management',
      permission: 'rentManagement' as keyof EmployeePermissions
    },
    { 
      icon: Calculator, 
      label: t('navigation.rentalCharges'), 
      path: '/admin/rental-charges',
      permission: 'rentalCharges' as keyof EmployeePermissions
    },
    { 
      icon: TrendingUp, 
      label: t('navigation.forecasting'), 
      path: '/admin/forecasting',
      permission: 'dashboard' as keyof EmployeePermissions
    },
    { 
      icon: Wrench, 
      label: t('navigation.maintenance'), 
      path: '/admin/maintenance',
      permission: 'maintenance' as keyof EmployeePermissions
    },
    { 
      icon: MessageCircle, 
      label: t('navigation.messages'), 
      path: '/admin/messages',
      permission: 'messages' as keyof EmployeePermissions
    },
    { 
      icon: FileText, 
      label: t('navigation.taxes'), 
      path: '/admin/taxes',
      permission: 'taxes' as keyof EmployeePermissions
    },
    { 
      icon: Globe, 
      label: t('navigation.website'), 
      path: '/admin/website',
      permission: 'website' as keyof EmployeePermissions
    },
    { 
      icon: Settings, 
      label: t('navigation.settings'), 
      path: '/admin/settings',
      permission: 'settings' as keyof EmployeePermissions
    },
    { 
      icon: HelpCircle, 
      label: t('navigation.help'), 
      path: '/admin/help',
      permission: 'dashboard' as keyof EmployeePermissions
    }
  ];
};
