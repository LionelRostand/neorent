
import { FileText, Users, Home, Calculator, Wrench, Plus, LayoutDashboard, TrendingUp, MessageSquare } from 'lucide-react';

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
    title: t('ownerSpace.dashboard.title'),
    description: t('ownerSpace.dashboard.description'),
    icon: LayoutDashboard,
    color: 'bg-slate-500',
    action: () => {
      console.log('Showing dashboard view');
      setActiveView('dashboard');
    },
    preview: t('ownerSpace.dashboard.preview'),
    navigationAction: () => setActiveView('dashboard')
  },
  {
    id: 'property',
    title: t('ownerSpace.quickActions.newProperty.title'),
    description: t('ownerSpace.quickActions.newProperty.description'),
    icon: Plus,
    color: 'bg-blue-500',
    action: () => {
      console.log('Showing property form');
      setActiveView('property');
    },
    preview: t('ownerSpace.quickActions.newProperty.preview', { count: ownerProperties.length }),
    navigationAction: () => setActiveView('property')
  },
  {
    id: 'contract',
    title: t('ownerSpace.quickActions.newContract.title'),
    description: t('ownerSpace.quickActions.newContract.description'),
    icon: FileText,
    color: 'bg-yellow-500',
    action: () => {
      console.log('Showing contract form');
      setActiveView('contract');
    },
    preview: t('ownerSpace.quickActions.newContract.preview', { count: expiringContracts }),
    navigationAction: () => setActiveView('contract')
  },
  {
    id: 'roommate',
    title: t('ownerSpace.quickActions.addTenant.title'),
    description: t('ownerSpace.quickActions.addTenant.description'),
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      console.log('Showing tenant form');
      setActiveView('roommate');
    },
    preview: t('ownerSpace.quickActions.addTenant.preview', { count: activeTenants.length }),
    navigationAction: () => setActiveView('roommate')
  },
  {
    id: 'inspection',
    title: t('ownerSpace.quickActions.propertyInspection.title'),
    description: t('ownerSpace.quickActions.propertyInspection.description'),
    icon: Home,
    color: 'bg-orange-500',
    action: () => {
      console.log('Showing inspection form');
      setActiveView('inspection');
    },
    preview: t('ownerSpace.quickActions.propertyInspection.preview'),
    navigationAction: () => setActiveView('inspection')
  },
  {
    id: 'forecasting',
    title: t('ownerSpace.quickActions.forecasting.title'),
    description: t('ownerSpace.quickActions.forecasting.description'),
    icon: TrendingUp,
    color: 'bg-emerald-500',
    action: () => {
      console.log('Navigating to forecasting');
      navigate('/admin/forecasting');
    },
    preview: t('ownerSpace.quickActions.forecasting.preview'),
    navigationAction: () => navigate('/admin/forecasting')
  },
  {
    id: 'maintenance',
    title: t('ownerSpace.quickActions.maintenance.title'),
    description: t('ownerSpace.quickActions.maintenance.description'),
    icon: Wrench,
    color: 'bg-red-500',
    action: () => {
      console.log('Navigating to maintenance');
      navigate('/admin/maintenance');
    },
    preview: t('ownerSpace.quickActions.maintenance.preview'),
    navigationAction: () => navigate('/admin/maintenance')
  },
  {
    id: 'messages',
    title: t('ownerSpace.quickActions.messages.title'),
    description: t('ownerSpace.quickActions.messages.description'),
    icon: MessageSquare,
    color: 'bg-indigo-500',
    action: () => {
      console.log('Navigating to messages');
      navigate('/admin/messages');
    },
    preview: t('ownerSpace.quickActions.messages.preview'),
    navigationAction: () => navigate('/admin/messages')
  },
  {
    id: 'taxes',
    title: t('ownerSpace.quickActions.taxes.title'),
    description: t('ownerSpace.quickActions.taxes.description'),
    icon: FileText,
    color: 'bg-cyan-500',
    action: () => {
      console.log('Navigating to taxes');
      navigate('/admin/taxes');
    },
    preview: t('ownerSpace.quickActions.taxes.preview'),
    navigationAction: () => navigate('/admin/taxes')
  },
  {
    id: 'charges',
    title: t('ownerSpace.quickActions.calculateCharges.title'),
    description: t('ownerSpace.quickActions.calculateCharges.description'),
    icon: Calculator,
    color: 'bg-teal-500',
    action: () => {
      console.log('Navigating to rental charges');
      navigate('/admin/rental-charges');
    },
    preview: t('ownerSpace.quickActions.calculateCharges.preview'),
    navigationAction: () => navigate('/admin/rental-charges')
  }
];
