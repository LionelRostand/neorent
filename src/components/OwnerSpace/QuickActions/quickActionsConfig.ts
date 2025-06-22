
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
  pendingPayments: number
): QuickAction[] => [
  {
    id: 'property',
    title: "New Property",
    description: "Add a property",
    icon: Plus,
    color: 'bg-blue-500',
    action: () => {
      console.log('Opening property dialog');
      setOpenDialog('property');
    },
    preview: `${ownerProperties.length} properties`,
    navigationAction: () => navigate('/admin/properties')
  },
  {
    id: 'contract',
    title: "New Contract",
    description: "Create a lease",
    icon: FileText,
    color: 'bg-green-500',
    action: () => {
      console.log('Navigating to contracts');
      navigate('/admin/contracts');
    },
    preview: `${expiringContracts} contracts expiring soon`,
    navigationAction: () => navigate('/admin/contracts')
  },
  {
    id: 'tenant',
    title: "Add Tenant",
    description: "Register a tenant",
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      console.log('Opening tenant dialog');
      setOpenDialog('roommate');
    },
    preview: `${activeTenants.length} active tenants`,
    navigationAction: () => navigate('/admin/roommates')
  },
  {
    id: 'inspection',
    title: "Property Inspection",
    description: "Schedule a visit",
    icon: Home,
    color: 'bg-orange-500',
    action: () => {
      console.log('Opening inspection dialog');
      setOpenDialog('inspection');
    },
    preview: '2 scheduled inspections',
    navigationAction: () => navigate('/admin/inspections')
  },
  {
    id: 'charges',
    title: "Calculate Charges",
    description: "Annual review",
    icon: Calculator,
    color: 'bg-indigo-500',
    action: () => {
      console.log('Navigating to rental charges');
      navigate('/admin/rental-charges');
    },
    preview: `${pendingPayments} pending payments`,
    navigationAction: () => navigate('/admin/rental-charges')
  },
  {
    id: 'maintenance',
    title: "Maintenance",
    description: "Request intervention",
    icon: Wrench,
    color: 'bg-red-500',
    action: () => {
      console.log('Navigating to maintenance');
      navigate('/admin/maintenance');
    },
    preview: '1 urgent request',
    navigationAction: () => navigate('/admin/maintenance')
  }
];
