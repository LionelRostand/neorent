
import { 
  LayoutDashboard, 
  Building, 
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
  HelpCircle,
  LucideIcon 
} from 'lucide-react';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  preview: string;
  action: () => void;
}

export const createQuickActionsConfig = (
  navigate: (path: string) => void,
  setOpenDialog: (dialog: string | null) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContractsCount: number,
  pendingPaymentsCount: number,
  t: (key: string) => string,
  enabledActions: any[],
  setActiveView?: (view: string) => void,
  currentLanguage?: string
): QuickAction[] => {
  
  // Helper function to get localized text
  const getText = (actionId: string, textType: 'title' | 'description' | 'preview') => {
    const lang = currentLanguage || 'fr';
    
    const translations: Record<string, Record<string, Record<string, string>>> = {
      dashboard: {
        title: { fr: 'Tableau de bord', en: 'Dashboard' },
        description: { fr: 'Vue d\'ensemble', en: 'Overview' },
        preview: { fr: `${ownerProperties.length} biens`, en: `${ownerProperties.length} properties` }
      },
      properties: {
        title: { fr: 'Propriétés', en: 'Properties' },
        description: { fr: 'Gestion des biens', en: 'Property management' },
        preview: { fr: `${ownerProperties.length} propriétés`, en: `${ownerProperties.length} properties` }
      },
      tenants: {
        title: { fr: 'Locataires', en: 'Tenants' },
        description: { fr: 'Gestion locataires', en: 'Tenant management' },
        preview: { fr: `${activeTenants.length} actifs`, en: `${activeTenants.length} active` }
      },
      roommates: {
        title: { fr: 'Colocataires', en: 'Roommates' },
        description: { fr: 'Gestion colocataires', en: 'Roommate management' },
        preview: { fr: 'Gérer les colocataires', en: 'Manage roommates' }
      },
      contracts: {
        title: { fr: 'Contrats', en: 'Contracts' },
        description: { fr: 'Gestion des baux', en: 'Lease management' },
        preview: { fr: `${expiringContractsCount} expirent bientôt`, en: `${expiringContractsCount} expiring soon` }
      },
      inspections: {
        title: { fr: 'Inspections', en: 'Inspections' },
        description: { fr: 'États des lieux', en: 'Property inspections' },
        preview: { fr: 'Inspections programmées', en: 'Scheduled inspections' }
      },
      'rent-management': {
        title: { fr: 'Gestion des loyers', en: 'Rent Management' },
        description: { fr: 'Suivi des paiements', en: 'Payment tracking' },
        preview: { fr: `${pendingPaymentsCount} en attente`, en: `${pendingPaymentsCount} pending` }
      },
      'rental-charges': {
        title: { fr: 'Charges locatives', en: 'Rental Charges' },
        description: { fr: 'Gestion des charges', en: 'Charges management' },
        preview: { fr: 'Charges mensuelles', en: 'Monthly charges' }
      },
      forecasting: {
        title: { fr: 'Prévisions', en: 'Forecasting' },
        description: { fr: 'Analyse financière', en: 'Financial analysis' },
        preview: { fr: 'Projections revenus', en: 'Revenue projections' }
      },
      maintenance: {
        title: { fr: 'Maintenance', en: 'Maintenance' },
        description: { fr: 'Interventions', en: 'Service requests' },
        preview: { fr: 'Demandes ouvertes', en: 'Open requests' }
      },
      messages: {
        title: { fr: 'Messages', en: 'Messages' },
        description: { fr: 'Communication', en: 'Communication' },
        preview: { fr: 'Nouveaux messages', en: 'New messages' }
      },
      taxes: {
        title: { fr: 'Fiscalité', en: 'Tax Management' },
        description: { fr: 'Gestion fiscale', en: 'Tax management' },
        preview: { fr: 'Déclarations', en: 'Tax returns' }
      },
      website: {
        title: { fr: 'Site web', en: 'Website' },
        description: { fr: 'Gestion site', en: 'Website management' },
        preview: { fr: 'Configuration', en: 'Configuration' }
      },
      settings: {
        title: { fr: 'Paramètres', en: 'Settings' },
        description: { fr: 'Configuration', en: 'Configuration' },
        preview: { fr: 'Système', en: 'System' }
      },
      help: {
        title: { fr: 'Aide', en: 'Help' },
        description: { fr: 'Support', en: 'Support' },
        preview: { fr: 'Documentation', en: 'Documentation' }
      }
    };

    return translations[actionId]?.[textType]?.[lang] || translations[actionId]?.[textType]?.['fr'] || '';
  };
  
  const baseActions: Record<string, Omit<QuickAction, 'title' | 'description' | 'preview'>> = {
    dashboard: {
      id: 'dashboard',
      icon: LayoutDashboard,
      color: 'bg-slate-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      }
    },
    properties: {
      id: 'properties',
      icon: Building,
      color: 'bg-blue-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-properties');
        } else {
          navigate('/admin/properties');
        }
      }
    },
    tenants: {
      id: 'tenants',
      icon: Users,
      color: 'bg-purple-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-tenants');
        } else {
          navigate('/admin/tenants');
        }
      }
    },
    roommates: {
      id: 'roommates',
      icon: UserPlus,
      color: 'bg-pink-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-roommates');
        } else {
          navigate('/admin/roommates');
        }
      }
    },
    contracts: {
      id: 'contracts',
      icon: FileText,
      color: 'bg-yellow-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-contracts');
        } else {
          navigate('/admin/contracts');
        }
      }
    },
    inspections: {
      id: 'inspections',
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-inspections');
        } else {
          navigate('/admin/inspections');
        }
      }
    },
    'rent-management': {
      id: 'rent-management',
      icon: DollarSign,
      color: 'bg-green-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-rent-management');
        } else {
          navigate('/admin/rent-management');
        }
      }
    },
    'rental-charges': {
      id: 'rental-charges',
      icon: Receipt,
      color: 'bg-teal-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-rental-charges');
        } else {
          navigate('/admin/rental-charges');
        }
      }
    },
    forecasting: {
      id: 'forecasting',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-forecasting');
        } else {
          navigate('/admin/forecasting');
        }
      }
    },
    maintenance: {
      id: 'maintenance',
      icon: Wrench,
      color: 'bg-red-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-maintenance');
        } else {
          navigate('/admin/maintenance');
        }
      }
    },
    messages: {
      id: 'messages',
      icon: MessageSquare,
      color: 'bg-indigo-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-messages');
        } else {
          navigate('/admin/messages');
        }
      }
    },
    taxes: {
      id: 'taxes',
      icon: Calculator,
      color: 'bg-cyan-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-taxes');
        } else {
          navigate('/admin/taxes');
        }
      }
    },
    website: {
      id: 'website',
      icon: Globe,
      color: 'bg-violet-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-website');
        } else {
          navigate('/admin/website');
        }
      }
    },
    settings: {
      id: 'settings',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-settings');
        } else {
          navigate('/admin/settings');
        }
      }
    },
    help: {
      id: 'help',
      icon: HelpCircle,
      color: 'bg-amber-500',
      action: () => {
        if (setActiveView) {
          setActiveView('admin-help');
        } else {
          navigate('/admin/help');
        }
      }
    }
  };

  return enabledActions
    .map(actionConfig => {
      const baseAction = baseActions[actionConfig.id];
      if (!baseAction) return null;

      return {
        ...baseAction,
        title: getText(actionConfig.id, 'title'),
        description: getText(actionConfig.id, 'description'),
        preview: getText(actionConfig.id, 'preview'),
        color: actionConfig.color || baseAction.color,
      };
    })
    .filter(Boolean) as QuickAction[];
};
