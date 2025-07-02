
import { 
  Building, Plus, Users, FileText, Calendar, 
  DollarSign, Calculator, Wrench, MessageSquare, 
  FileBarChart, Globe, Settings, HelpCircle,
  BarChart3, Home
} from 'lucide-react';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';

export const createQuickActionsConfig = (
  navigate: (path: string) => void,
  setOpenDialog: (dialog: string) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  t: (key: string, fallback?: string) => string,
  enabledActions: QuickActionConfig[],
  onViewChange?: (view: string) => void,
  currentLanguage?: string
) => {
  // Create a map of enabled actions for quick lookup
  const enabledActionsMap = enabledActions.reduce((acc, action) => {
    acc[action.id] = action;
    return acc;
  }, {} as Record<string, QuickActionConfig>);

  // Base configuration with all possible actions
  const allActions = [
    {
      id: 'dashboard',
      icon: BarChart3,
      title: t('ownerSpace.dashboard.title'),
      description: t('ownerSpace.dashboard.description'),
      preview: t('ownerSpace.dashboard.preview'),
      color: 'bg-slate-500',
      action: () => onViewChange ? onViewChange('dashboard') : navigate('/admin/dashboard')
    },
    {
      id: 'newProperty',
      icon: Building,
      title: t('ownerSpace.quickActions.newProperty.title'),
      description: t('ownerSpace.quickActions.newProperty.description'),
      preview: t('ownerSpace.quickActions.newProperty.preview', { count: ownerProperties.length }),
      color: 'bg-blue-500',
      action: () => setOpenDialog('property')
    },
    {
      id: 'newContract',
      icon: FileText,
      title: t('ownerSpace.quickActions.newContract.title'),
      description: t('ownerSpace.quickActions.newContract.description'),
      preview: t('ownerSpace.quickActions.newContract.preview', { count: expiringContracts }),
      color: 'bg-yellow-500',
      action: () => setOpenDialog('contract')
    },
    {
      id: 'addTenant',
      icon: Users,
      title: t('ownerSpace.quickActions.addTenant.title'),
      description: t('ownerSpace.quickActions.addTenant.description'),
      preview: t('ownerSpace.quickActions.addTenant.preview', { count: activeTenants.length }),
      color: 'bg-purple-500',
      action: () => setOpenDialog('tenant')
    },
    {
      id: 'propertyInspection',
      icon: Calendar,
      title: t('ownerSpace.quickActions.propertyInspection.title'),
      description: t('ownerSpace.quickActions.propertyInspection.description'),
      preview: t('ownerSpace.quickActions.propertyInspection.preview'),
      color: 'bg-orange-500',
      action: () => setOpenDialog('inspection')
    },
    {
      id: 'calculateCharges',
      icon: Calculator,
      title: t('ownerSpace.quickActions.calculateCharges.title'),
      description: t('ownerSpace.quickActions.calculateCharges.description'),
      preview: t('ownerSpace.quickActions.calculateCharges.preview'),
      color: 'bg-teal-500',
      action: () => onViewChange ? onViewChange('rental-charges') : navigate('/admin/rental-charges')
    },
    {
      id: 'maintenance',
      icon: Wrench,
      title: t('ownerSpace.quickActions.maintenance.title'),
      description: t('ownerSpace.quickActions.maintenance.description'),
      preview: t('ownerSpace.quickActions.maintenance.preview'),
      color: 'bg-red-500',
      action: () => onViewChange ? onViewChange('maintenance') : navigate('/admin/maintenance')
    },
    {
      id: 'forecasting',
      icon: FileBarChart,
      title: t('ownerSpace.quickActions.forecasting.title'),
      description: t('ownerSpace.quickActions.forecasting.description'),
      preview: t('ownerSpace.quickActions.forecasting.preview'),
      color: 'bg-emerald-500',
      action: () => onViewChange ? onViewChange('forecasting') : navigate('/admin/forecasting')
    },
    {
      id: 'messages',
      icon: MessageSquare,
      title: t('ownerSpace.quickActions.messages.title'),
      description: t('ownerSpace.quickActions.messages.description'),
      preview: t('ownerSpace.quickActions.messages.preview'),
      color: 'bg-indigo-500',
      action: () => onViewChange ? onViewChange('messages') : navigate('/admin/messages')
    },
    {
      id: 'taxes',
      icon: DollarSign,
      title: t('ownerSpace.quickActions.taxes.title'),
      description: t('ownerSpace.quickActions.taxes.description'),
      preview: t('ownerSpace.quickActions.taxes.preview'),
      color: 'bg-cyan-500',
      action: () => onViewChange ? onViewChange('taxes') : navigate('/admin/taxes')
    },
    {
      id: 'website',
      icon: Globe,
      title: t('ownerSpace.quickActions.website.title'),
      description: t('ownerSpace.quickActions.website.description'),
      preview: t('ownerSpace.quickActions.website.preview'),
      color: 'bg-violet-500',
      action: () => onViewChange ? onViewChange('website') : navigate('/admin/website')
    },
    {
      id: 'settings',
      icon: Settings,
      title: t('ownerSpace.quickActions.settings.title'),
      description: t('ownerSpace.quickActions.settings.description'),
      preview: t('ownerSpace.quickActions.settings.preview'),
      color: 'bg-gray-500',
      action: () => onViewChange ? onViewChange('settings') : navigate('/admin/settings')
    }
  ];

  // Filter to only return enabled actions in the correct order
  return enabledActions
    .map(enabledAction => {
      const baseAction = allActions.find(action => action.id === enabledAction.id);
      if (baseAction) {
        return {
          ...baseAction,
          enabled: enabledAction.enabled
        };
      }
      return null;
    })
    .filter(Boolean) as typeof allActions;
};
