
import {
  LayoutDashboard,
  Plus,
  FileText,
  Users,
  ClipboardList,
  Calculator,
  Wrench,
  Building,
  UserCheck,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Globe,
  Settings,
  HelpCircle
} from 'lucide-react';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  preview: string;
  icon: any;
  color: string;
  action: () => void;
}

const getPreviewForAction = (
  actionId: string,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number
): string => {
  switch (actionId) {
    case 'property':
    case 'admin-properties':
      return `${ownerProperties.length} biens immobiliers`;
    case 'roommate':
    case 'admin-roommates':
      return `${activeTenants.length} locataires actifs`;
    case 'contract':
    case 'admin-contracts':
      return `${expiringContracts} contrats expirent bientôt`;
    case 'charges':
    case 'admin-rental-charges':
      return `${pendingPayments} paiements en attente`;
    case 'admin-dashboard':
      return 'Vue d\'ensemble';
    case 'admin-tenants':
      return 'Gestion des locataires';
    case 'admin-inspections':
      return 'Suivi des inspections';
    case 'admin-rent-management':
      return 'Gestion des loyers';
    case 'admin-forecasting':
      return 'Prévisions financières';
    case 'admin-maintenance':
      return 'Demandes de maintenance';
    case 'admin-messages':
      return 'Communication';
    case 'admin-taxes':
      return 'Déclarations fiscales';
    case 'admin-website':
      return 'Site web';
    case 'admin-settings':
      return 'Configuration';
    case 'admin-help':
      return 'Centre d\'aide';
    default:
      return 'Voir les détails';
  }
};

export const createQuickActionsConfig = (
  navigate: any,
  setActiveView: (view: string) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  t: any,
  enabledActions: any[]
) => {
  console.log('Creating quick actions config with enabled actions:', enabledActions);
  
  const actionHandlers: Record<string, () => void> = {
    dashboard: () => setActiveView('dashboard'),
    property: () => setActiveView('property'),
    contract: () => setActiveView('contract'),
    roommate: () => setActiveView('roommate'),
    inspection: () => setActiveView('inspection'),
    charges: () => setActiveView('charges'),
    maintenance: () => setActiveView('maintenance'),
    
    // Admin menu handlers - set the view to show admin interface
    'admin-dashboard': () => setActiveView('admin-dashboard'),
    'admin-properties': () => setActiveView('admin-properties'),
    'admin-tenants': () => setActiveView('admin-tenants'),
    'admin-roommates': () => setActiveView('admin-roommates'),
    'admin-contracts': () => setActiveView('admin-contracts'),
    'admin-inspections': () => setActiveView('admin-inspections'),
    'admin-rent-management': () => setActiveView('admin-rent-management'),
    'admin-rental-charges': () => setActiveView('admin-rental-charges'),
    'admin-forecasting': () => setActiveView('admin-forecasting'),
    'admin-maintenance': () => setActiveView('admin-maintenance'),
    'admin-messages': () => setActiveView('admin-messages'),
    'admin-taxes': () => setActiveView('admin-taxes'),
    'admin-website': () => setActiveView('admin-website'),
    'admin-settings': () => setActiveView('admin-settings'),
    'admin-help': () => setActiveView('admin-help'),
  };

  return enabledActions.map(actionConfig => {
    const iconMap: Record<string, any> = {
      LayoutDashboard: LayoutDashboard,
      Plus: Plus,
      FileText: FileText,
      Users: Users,
      ClipboardList: ClipboardList,
      Calculator: Calculator,
      Wrench: Wrench,
      Building: Building,
      UserCheck: UserCheck,
      DollarSign: DollarSign,
      TrendingUp: TrendingUp,
      MessageCircle: MessageCircle,
      Globe: Globe,
      Settings: Settings,
      HelpCircle: HelpCircle
    };

    const Icon = iconMap[actionConfig.icon] || Settings;
    
    // Use action handler based on action ID
    const actionHandler = actionHandlers[actionConfig.id] || (() => console.log('No handler for:', actionConfig.id));

    return {
      id: actionConfig.id,
      title: actionConfig.title.fr || actionConfig.title,
      description: actionConfig.description.fr || actionConfig.description,
      preview: getPreviewForAction(actionConfig.id, ownerProperties, activeTenants, expiringContracts, pendingPayments),
      icon: Icon,
      color: actionConfig.color,
      action: actionHandler
    };
  }).filter(Boolean);
};
