
import { FileText, Users, Home, Calculator, Wrench, Plus, LayoutDashboard } from 'lucide-react';

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
  setActiveView: (view: string) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  t: (key: string, options?: any) => string
): QuickAction[] => [
  {
    id: 'dashboard',
    title: t('quickActions.dashboard.title'),
    description: t('quickActions.dashboard.description'),
    icon: LayoutDashboard,
    color: 'bg-slate-500',
    action: () => {
      console.log('Showing dashboard view');
      setActiveView('dashboard');
    },
    preview: t('quickActions.dashboard.preview'),
    navigationAction: () => setActiveView('dashboard')
  },
  {
    id: 'property',
    title: t('quickActions.newProperty.title'),
    description: t('quickActions.newProperty.description'),
    icon: Plus,
    color: 'bg-blue-500',
    action: () => {
      console.log('Showing property form');
      setActiveView('property');
    },
    preview: t('quickActions.newProperty.preview', { count: ownerProperties.length }),
    navigationAction: () => setActiveView('property')
  },
  {
    id: 'contract',
    title: t('quickActions.newContract.title'),
    description: t('quickActions.newContract.description'),
    icon: FileText,
    color: 'bg-green-500',
    action: () => {
      console.log('Showing contract form');
      setActiveView('contract');
    },
    preview: t('quickActions.newContract.preview', { count: expiringContracts }),
    navigationAction: () => setActiveView('contract')
  },
  {
    id: 'roommate',
    title: t('quickActions.addTenant.title'),
    description: t('quickActions.addTenant.description'),
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      console.log('Showing tenant form');
      setActiveView('roommate');
    },
    preview: t('quickActions.addTenant.preview', { count: activeTenants.length }),
    navigationAction: () => setActiveView('roommate')
  },
  {
    id: 'inspection',
    title: t('quickActions.inspection.title'),
    description: t('quickActions.inspection.description'),
    icon: Home,
    color: 'bg-orange-500',
    action: () => {
      console.log('Showing inspection form');
      setActiveView('inspection');
    },
    preview: t('quickActions.inspection.preview'),
    navigationAction: () => setActiveView('inspection')
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
