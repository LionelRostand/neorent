
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
    title: 'Dashboard',
    description: 'View overview',
    icon: LayoutDashboard,
    color: 'bg-slate-500',
    action: () => {
      console.log('Showing dashboard view');
      setActiveView('dashboard');
    },
    preview: 'System overview',
    navigationAction: () => setActiveView('dashboard')
  },
  {
    id: 'property',
    title: 'New property',
    description: 'Add a property',
    icon: Plus,
    color: 'bg-blue-500',
    action: () => {
      console.log('Showing property form');
      setActiveView('property');
    },
    preview: `${ownerProperties.length} properties`,
    navigationAction: () => setActiveView('property')
  },
  {
    id: 'contract',
    title: 'New contract',
    description: 'Create a lease',
    icon: FileText,
    color: 'bg-yellow-500',
    action: () => {
      console.log('Showing contract form');
      setActiveView('contract');
    },
    preview: `${expiringContracts} expiring`,
    navigationAction: () => setActiveView('contract')
  },
  {
    id: 'roommate',
    title: 'Add tenant',
    description: 'Register a tenant',
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      console.log('Showing tenant form');
      setActiveView('roommate');
    },
    preview: `${activeTenants.length} active tenants`,
    navigationAction: () => setActiveView('roommate')
  },
  {
    id: 'inspection',
    title: 'Inspection',
    description: 'Schedule a visit',
    icon: Home,
    color: 'bg-orange-500',
    action: () => {
      console.log('Showing inspection form');
      setActiveView('inspection');
    },
    preview: 'Property inspections',
    navigationAction: () => setActiveView('inspection')
  },
  {
    id: 'forecasting',
    title: 'Financial forecasting',
    description: 'Revenue projections',
    icon: TrendingUp,
    color: 'bg-emerald-500',
    action: () => {
      console.log('Navigating to forecasting');
      navigate('/admin/forecasting');
    },
    preview: 'Revenue projections',
    navigationAction: () => navigate('/admin/forecasting')
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Request intervention',
    icon: Wrench,
    color: 'bg-red-500',
    action: () => {
      console.log('Navigating to maintenance');
      navigate('/admin/maintenance');
    },
    preview: '1 urgent request',
    navigationAction: () => navigate('/admin/maintenance')
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'Chat with tenants',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    action: () => {
      console.log('Navigating to messages');
      navigate('/admin/messages');
    },
    preview: 'Communication center',
    navigationAction: () => navigate('/admin/messages')
  },
  {
    id: 'taxes',
    title: 'Tax management',
    description: 'Tax declarations',
    icon: FileText,
    color: 'bg-cyan-500',
    action: () => {
      console.log('Navigating to taxes');
      navigate('/admin/taxes');
    },
    preview: 'Tax declarations',
    navigationAction: () => navigate('/admin/taxes')
  },
  {
    id: 'charges',
    title: 'Calculate charges',
    description: 'Annual review',
    icon: Calculator,
    color: 'bg-teal-500',
    action: () => {
      console.log('Navigating to rental charges');
      navigate('/admin/rental-charges');
    },
    preview: '0 pending payments',
    navigationAction: () => navigate('/admin/rental-charges')
  }
];
