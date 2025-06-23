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

const iconMap: Record<string, any> = {
  FileText,
  Users,
  Home,
  Calculator,
  Wrench,
  Plus,
  LayoutDashboard,
  TrendingUp,
  MessageSquare
};

export const createQuickActionsConfig = (
  navigate: (path: string) => void,
  setActiveView: (view: string) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  t: (key: string, options?: any) => string,
  allActions?: any[] // Receive all actions, filter here
): QuickAction[] => {
  // Get current language for localized texts
  const currentLang = document.documentElement.lang || 'fr';
  
  const getLocalizedText = (key: string, fallback: string = '') => {
    const texts: Record<string, Record<string, string>> = {
      properties: {
        fr: 'propriétés',
        en: 'properties'
      },
      expiring: {
        fr: 'expirent',
        en: 'expiring'
      },
      activeTenants: {
        fr: 'locataires actifs',
        en: 'active tenants'
      },
      systemOverview: {
        fr: 'Aperçu du système',
        en: 'System overview'
      },
      propertyInspections: {
        fr: 'Inspections des propriétés',
        en: 'Property inspections'
      },
      revenueProjections: {
        fr: 'Projections de revenus',
        en: 'Revenue projections'
      },
      urgentRequest: {
        fr: '1 demande urgente',
        en: '1 urgent request'
      },
      communicationCenter: {
        fr: 'Centre de communication',
        en: 'Communication center'
      },
      taxDeclarations: {
        fr: 'Déclarations fiscales',
        en: 'Tax declarations'
      },
      pendingPayments: {
        fr: '0 paiements en attente',
        en: '0 pending payments'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || fallback;
  };

  // Use managed actions if available - this should ONLY contain enabled actions
  if (allActions && allActions.length > 0) {
    console.log('Creating quick actions config with enabled actions:', allActions);
    
    return allActions.map((actionConfig) => ({
      id: actionConfig.id,
      title: actionConfig.title[currentLang] || actionConfig.title.fr,
      description: actionConfig.description[currentLang] || actionConfig.description.fr,
      icon: iconMap[actionConfig.icon] || Plus,
      color: actionConfig.color,
      action: () => {
        if (actionConfig.action === 'navigate') {
          navigate(actionConfig.actionValue);
        } else {
          setActiveView(actionConfig.actionValue);
        }
      },
      preview: getPreviewForAction(actionConfig.id, ownerProperties, activeTenants, expiringContracts, pendingPayments, getLocalizedText),
      navigationAction: () => {
        if (actionConfig.action === 'navigate') {
          navigate(actionConfig.actionValue);
        } else {
          setActiveView(actionConfig.actionValue);
        }
      }
    }));
  }

  // Default actions if no managed configuration (fallback)
  console.log('Using default actions as fallback');
  return [
    {
      id: 'dashboard',
      title: getLocalizedText('dashboard', 'Tableau de bord'),
      description: getLocalizedText('dashboardDesc', 'Vue d\'ensemble'),
      icon: LayoutDashboard,
      color: 'bg-slate-500',
      action: () => {
        console.log('Showing dashboard view');
        setActiveView('dashboard');
      },
      preview: getLocalizedText('systemOverview'),
      navigationAction: () => setActiveView('dashboard')
    },
    {
      id: 'property',
      title: getLocalizedText('newProperty'),
      description: getLocalizedText('newPropertyDesc'),
      icon: Plus,
      color: 'bg-blue-500',
      action: () => {
        console.log('Showing property form');
        setActiveView('property');
      },
      preview: `${ownerProperties.length} ${getLocalizedText('properties')}`,
      navigationAction: () => setActiveView('property')
    },
    {
      id: 'contract',
      title: getLocalizedText('newContract'),
      description: getLocalizedText('newContractDesc'),
      icon: FileText,
      color: 'bg-yellow-500',
      action: () => {
        console.log('Showing contract form');
        setActiveView('contract');
      },
      preview: `${expiringContracts} ${getLocalizedText('expiring')}`,
      navigationAction: () => setActiveView('contract')
    },
    {
      id: 'roommate',
      title: getLocalizedText('addTenant'),
      description: getLocalizedText('addTenantDesc'),
      icon: Users,
      color: 'bg-purple-500',
      action: () => {
        console.log('Showing tenant form');
        setActiveView('roommate');
      },
      preview: `${activeTenants.length} ${getLocalizedText('activeTenants')}`,
      navigationAction: () => setActiveView('roommate')
    },
    {
      id: 'inspection',
      title: getLocalizedText('propertyInspection'),
      description: getLocalizedText('propertyInspectionDesc'),
      icon: Home,
      color: 'bg-orange-500',
      action: () => {
        console.log('Showing inspection form');
        setActiveView('inspection');
      },
      preview: getLocalizedText('propertyInspectionPreview'),
      navigationAction: () => setActiveView('inspection')
    },
    {
      id: 'forecasting',
      title: getLocalizedText('forecasting'),
      description: getLocalizedText('forecastingDesc'),
      icon: TrendingUp,
      color: 'bg-emerald-500',
      action: () => {
        console.log('Navigating to forecasting');
        navigate('/admin/forecasting');
      },
      preview: getLocalizedText('forecastingPreview'),
      navigationAction: () => navigate('/admin/forecasting')
    },
    {
      id: 'maintenance',
      title: getLocalizedText('maintenance'),
      description: getLocalizedText('maintenanceDesc'),
      icon: Wrench,
      color: 'bg-red-500',
      action: () => {
        console.log('Navigating to maintenance');
        navigate('/admin/maintenance');
      },
      preview: getLocalizedText('maintenancePreview'),
      navigationAction: () => navigate('/admin/maintenance')
    },
    {
      id: 'messages',
      title: getLocalizedText('messages'),
      description: getLocalizedText('messagesDesc'),
      icon: MessageSquare,
      color: 'bg-indigo-500',
      action: () => {
        console.log('Navigating to messages');
        navigate('/admin/messages');
      },
      preview: getLocalizedText('messagesPreview'),
      navigationAction: () => navigate('/admin/messages')
    },
    {
      id: 'taxes',
      title: getLocalizedText('taxes'),
      description: getLocalizedText('taxesDesc'),
      icon: FileText,
      color: 'bg-cyan-500',
      action: () => {
        console.log('Navigating to taxes');
        navigate('/admin/taxes');
      },
      preview: getLocalizedText('taxesPreview'),
      navigationAction: () => navigate('/admin/taxes')
    },
    {
      id: 'charges',
      title: getLocalizedText('charges'),
      description: getLocalizedText('chargesDesc'),
      icon: Calculator,
      color: 'bg-teal-500',
      action: () => {
        console.log('Navigating to rental charges');
        navigate('/admin/rental-charges');
      },
      preview: getLocalizedText('chargesPreview'),
      navigationAction: () => navigate('/admin/rental-charges')
    }
  ];
};

function getPreviewForAction(
  actionId: string,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number,
  getLocalizedText: (key: string, fallback?: string) => string
): string {
  switch (actionId) {
    case 'property':
      return `${ownerProperties.length} ${getLocalizedText('properties')}`;
    case 'contract':
      return `${expiringContracts} ${getLocalizedText('expiring')}`;
    case 'roommate':
      return `${activeTenants.length} ${getLocalizedText('activeTenants')}`;
    case 'inspection':
      return getLocalizedText('propertyInspections');
    case 'forecasting':
      return getLocalizedText('revenueProjections');
    case 'maintenance':
      return getLocalizedText('urgentRequest');
    case 'messages':
      return getLocalizedText('communicationCenter');
    case 'taxes':
      return getLocalizedText('taxDeclarations');
    case 'charges':
      return getLocalizedText('pendingPayments');
    case 'dashboard':
    default:
      return getLocalizedText('systemOverview');
  }
}
