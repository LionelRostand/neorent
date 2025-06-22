
import { FileText, Users, Home, Calculator, Wrench, Plus } from 'lucide-react';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
  preview: string;
  navigationAction?: () => void;
}

export const createQuickActionsConfig = (
  navigate: (path: string) => void,
  setOpenDialog: (dialogId: string | null) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  t: (key: string, options?: any) => string
): QuickAction[] => [
  {
    id: 'property',
    title: t('quickActions.newProperty.title'),
    description: t('quickActions.newProperty.description'),
    icon: Plus,
    color: 'bg-blue-500',
    action: () => {
      console.log('Opening property dialog');
      setOpenDialog('property');
    },
    preview: t('quickActions.newProperty.preview', { count: ownerProperties.length }),
    navigationAction: () => navigate('/admin/properties')
  },
  {
    id: 'contract',
    title: t('quickActions.newContract.title'),
    description: t('quickActions.newContract.description'),
    icon: FileText,
    color: 'bg-green-500',
    action: () => {
      console.log('Navigating to contracts');
      navigate('/admin/contracts');
    },
    preview: t('quickActions.newContract.preview', { count: expiringContracts }),
    navigationAction: () => navigate('/admin/contracts')
  },
  {
    id: 'tenant',
    title: t('quickActions.addTenant.title'),
    description: t('quickActions.addTenant.description'),
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      console.log('Opening tenant dialog');
      setOpenDialog('roommate');
    },
    preview: t('quickActions.addTenant.preview', { count: activeTenants.length }),
    navigationAction: () => navigate('/admin/roommates')
  },
  {
    id: 'inspection',
    title: t('quickActions.inspection.title'),
    description: t('quickActions.inspection.description'),
    icon: Home,
    color: 'bg-orange-500',
    action: () => {
      console.log('Opening inspection dialog');
      setOpenDialog('inspection');
    },
    preview: t('quickActions.inspection.preview'),
    navigationAction: () => navigate('/admin/inspections')
  },
  {
    id: 'charges',
    title: t('quickActions.charges.title'),
    description: t('quickActions.charges.description'),
    icon: Calculator,
    color: 'bg-indigo-500',
    action: () => {
      console.log('Navigating to rental charges');
      navigate('/admin/rental-charges');
    },
    preview: t('quickActions.charges.preview', { count: pendingPayments }),
    navigationAction: () => navigate('/admin/rental-charges')
  },
  {
    id: 'maintenance',
    title: t('quickActions.maintenance.title'),
    description: t('quickActions.maintenance.description'),
    icon: Wrench,
    color: 'bg-red-500',
    action: () => {
      console.log('Navigating to maintenance');
      navigate('/admin/maintenance');
    },
    preview: t('quickActions.maintenance.preview'),
    navigationAction: () => navigate('/admin/maintenance')
  }
];
