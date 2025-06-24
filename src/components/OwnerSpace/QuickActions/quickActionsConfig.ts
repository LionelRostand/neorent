
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
  setActiveView?: (view: string) => void
): QuickAction[] => {
  
  const baseActions: Record<string, QuickAction> = {
    dashboard: {
      id: 'dashboard',
      title: 'Tableau de bord',
      description: 'Vue d\'ensemble',
      icon: LayoutDashboard,
      color: 'bg-slate-500',
      preview: `${ownerProperties.length} biens`,
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
      title: 'Propriétés',
      description: 'Gestion des biens',
      icon: Building,
      color: 'bg-blue-500',
      preview: `${ownerProperties.length} propriétés`,
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
      title: 'Locataires',
      description: 'Gestion locataires',
      icon: Users,
      color: 'bg-purple-500',
      preview: `${activeTenants.length} actifs`,
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
      title: 'Colocataires',
      description: 'Gestion colocataires',
      icon: UserPlus,
      color: 'bg-pink-500',
      preview: `Gérer les colocataires`,
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
      title: 'Contrats',
      description: 'Gestion des baux',
      icon: FileText,
      color: 'bg-yellow-500',
      preview: `${expiringContractsCount} expirent bientôt`,
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
      title: 'Inspections',
      description: 'États des lieux',
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      preview: `Inspections programmées`,
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
      title: 'Gestion des loyers',
      description: 'Suivi des paiements',
      icon: DollarSign,
      color: 'bg-green-500',
      preview: `${pendingPaymentsCount} en attente`,
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
      title: 'Charges locatives',
      description: 'Gestion des charges',
      icon: Receipt,
      color: 'bg-teal-500',
      preview: `Charges mensuelles`,
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
      title: 'Prévisions',
      description: 'Analyse financière',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      preview: `Projections revenus`,
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
      title: 'Maintenance',
      description: 'Interventions',
      icon: Wrench,
      color: 'bg-red-500',
      preview: `Demandes ouvertes`,
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
      title: 'Messages',
      description: 'Communication',
      icon: MessageSquare,
      color: 'bg-indigo-500',
      preview: `Nouveaux messages`,
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
      title: 'Fiscalité',
      description: 'Gestion fiscale',
      icon: Calculator,
      color: 'bg-cyan-500',
      preview: `Déclarations`,
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
      title: 'Site web',
      description: 'Gestion site',
      icon: Globe,
      color: 'bg-violet-500',
      preview: `Configuration`,
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
      title: 'Paramètres',
      description: 'Configuration',
      icon: Settings,
      color: 'bg-gray-500',
      preview: `Système`,
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
      title: 'Aide',
      description: 'Support',
      icon: HelpCircle,
      color: 'bg-amber-500',
      preview: `Documentation`,
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
        title: actionConfig.title?.fr || baseAction.title,
        description: actionConfig.description?.fr || baseAction.description,
        color: actionConfig.color || baseAction.color,
      };
    })
    .filter(Boolean) as QuickAction[];
};
