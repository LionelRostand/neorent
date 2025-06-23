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

const getPreviewForAction = (
  actionId: string,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number
): string => {
  switch (actionId) {
    case 'property':
      return `${ownerProperties.length} biens immobiliers`;
    case 'roommate':
      return `${activeTenants.length} locataires actifs`;
    case 'contract':
      return `${expiringContracts} contrats expirent bientôt`;
    case 'charges':
      return `${pendingPayments} paiements en attente`;
    default:
      return 'Voir les détails';
  }
};

export const createQuickActionsConfig = (
  navigate: any,
  setOpenDialog: (dialog: string | null) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  t: any,
  enabledActions: any[]
) => {
  console.log('Creating quick actions config with enabled actions:', enabledActions);
  
  const actionHandlers: Record<string, () => void> = {
    dashboard: () => setOpenDialog('dashboard'),
    property: () => setOpenDialog('property'),
    contract: () => setOpenDialog('contract'),
    roommate: () => setOpenDialog('roommate'),
    inspection: () => setOpenDialog('inspection'),
    charges: () => setOpenDialog('charges'),
    maintenance: () => setOpenDialog('maintenance'),
    
    // Navigation handlers for admin pages
    properties: () => navigate('/admin/properties'),
    tenants: () => navigate('/admin/tenants'),
    roommates: () => navigate('/admin/roommates'),
    contracts: () => navigate('/admin/contracts'),
    inspections: () => navigate('/admin/inspections'),
    'rent-management': () => navigate('/admin/rent-management'),
    'rental-charges': () => navigate('/admin/rental-charges'),
    forecasting: () => navigate('/admin/forecasting'),
    maintenance: () => navigate('/admin/maintenance'),
    messages: () => navigate('/admin/messages'),
    taxes: () => navigate('/admin/taxes'),
    website: () => navigate('/admin/website'),
    settings: () => navigate('/admin/settings'),
    help: () => navigate('/admin/help')
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
    
    // Use action handler based on action type
    const actionHandler = actionConfig.action === 'navigate' 
      ? () => navigate(actionConfig.actionValue)
      : actionHandlers[actionConfig.id] || (() => console.log('No handler for:', actionConfig.id));

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
