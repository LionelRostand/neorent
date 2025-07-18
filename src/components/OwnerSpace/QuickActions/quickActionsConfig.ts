
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
  
  // Helper function to get localized text from translation files
  const getTranslatedText = (actionId: string, textType: 'title' | 'description' | 'preview') => {
    const lang = currentLanguage || 'fr';
    
    // Use i18n translation keys based on navigation translations
    const translationKeys: Record<string, string> = {
      dashboard: 'navigation.dashboard',
      properties: 'navigation.properties',
      tenants: 'navigation.tenants',
      roommates: 'navigation.roommates',
      contracts: 'navigation.contracts',
      inspections: 'navigation.inspections',
      'rent-management': 'navigation.rentManagement',
      'rental-charges': 'navigation.rentalCharges',
      forecasting: 'navigation.forecasting',
      maintenance: 'navigation.maintenance',
      messages: 'navigation.messages',
      taxes: 'navigation.taxes',
      website: 'navigation.website',
      settings: 'navigation.settings',
      help: 'navigation.help'
    };

    // For title, use navigation translations
    if (textType === 'title') {
      const key = translationKeys[actionId];
      return key ? t(key) : actionId;
    }

    // For description and preview, use localized fallbacks
    const descriptions: Record<string, Record<string, string>> = {
      dashboard: {
        fr: 'Vue d\'ensemble',
        en: 'Overview'
      },
      properties: {
        fr: 'Gestion des biens',
        en: 'Property management'
      },
      tenants: {
        fr: 'Gestion locataires',
        en: 'Tenant management'
      },
      roommates: {
        fr: 'Gestion colocataires',
        en: 'Roommate management'
      },
      contracts: {
        fr: 'Gestion des baux',
        en: 'Lease management'
      },
      inspections: {
        fr: 'États des lieux',
        en: 'Property inspections'
      },
      'rent-management': {
        fr: 'Suivi des paiements',
        en: 'Payment tracking'
      },
      'rental-charges': {
        fr: 'Gestion des charges',
        en: 'Charges management'
      },
      forecasting: {
        fr: 'Analyse financière',
        en: 'Financial analysis'
      },
      maintenance: {
        fr: 'Interventions',
        en: 'Service requests'
      },
      messages: {
        fr: 'Communication',
        en: 'Communication'
      },
      taxes: {
        fr: 'Gestion fiscale',
        en: 'Tax management'
      },
      website: {
        fr: 'Gestion site',
        en: 'Website management'
      },
      settings: {
        fr: 'Configuration',
        en: 'Configuration'
      },
      help: {
        fr: 'Support',
        en: 'Support'
      }
    };

    const previews: Record<string, Record<string, string>> = {
      dashboard: {
        fr: `${ownerProperties.length} biens`,
        en: `${ownerProperties.length} properties`
      },
      properties: {
        fr: `${ownerProperties.length} propriétés`,
        en: `${ownerProperties.length} properties`
      },
      tenants: {
        fr: `${activeTenants.length} actifs`,
        en: `${activeTenants.length} active`
      },
      roommates: {
        fr: 'Gérer les colocataires',
        en: 'Manage roommates'
      },
      contracts: {
        fr: `${expiringContractsCount} expirent bientôt`,
        en: `${expiringContractsCount} expiring soon`
      },
      inspections: {
        fr: 'Inspections programmées',
        en: 'Scheduled inspections'
      },
      'rent-management': {
        fr: `${pendingPaymentsCount} en attente`,
        en: `${pendingPaymentsCount} pending`
      },
      'rental-charges': {
        fr: 'Charges mensuelles',
        en: 'Monthly charges'
      },
      forecasting: {
        fr: 'Projections revenus',
        en: 'Revenue projections'
      },
      maintenance: {
        fr: 'Demandes ouvertes',
        en: 'Open requests'
      },
      messages: {
        fr: 'Nouveaux messages',
        en: 'New messages'
      },
      taxes: {
        fr: 'Déclarations',
        en: 'Tax returns'
      },
      website: {
        fr: 'Configuration',
        en: 'Configuration'
      },
      settings: {
        fr: 'Système',
        en: 'System'
      },
      help: {
        fr: 'Documentation',
        en: 'Documentation'
      }
    };

    if (textType === 'description') {
      return descriptions[actionId]?.[lang] || descriptions[actionId]?.['fr'] || '';
    }

    if (textType === 'preview') {
      return previews[actionId]?.[lang] || previews[actionId]?.['fr'] || '';
    }

    return '';
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
        title: getTranslatedText(actionConfig.id, 'title'),
        description: getTranslatedText(actionConfig.id, 'description'),
        preview: getTranslatedText(actionConfig.id, 'preview'),
        color: actionConfig.color || baseAction.color,
      };
    })
    .filter(Boolean) as QuickAction[];
};
