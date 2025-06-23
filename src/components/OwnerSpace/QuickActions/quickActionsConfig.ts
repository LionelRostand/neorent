
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
): QuickAction[] => {
  // Get current language for localized texts
  const currentLang = document.documentElement.lang || 'fr';
  
  const getLocalizedText = (key: string, fallback: string = '') => {
    const texts: Record<string, Record<string, string>> = {
      dashboard: {
        fr: 'Tableau de bord',
        en: 'Dashboard'
      },
      dashboardDesc: {
        fr: 'Vue d\'ensemble',
        en: 'Overview'
      },
      dashboardPreview: {
        fr: 'Aperçu du système',
        en: 'System overview'
      },
      newProperty: {
        fr: 'Nouvelle propriété',
        en: 'New Property'
      },
      newPropertyDesc: {
        fr: 'Ajouter un bien',
        en: 'Add a property'
      },
      newContract: {
        fr: 'Nouveau contrat',
        en: 'New Contract'
      },
      newContractDesc: {
        fr: 'Créer un bail',
        en: 'Create a lease'
      },
      addTenant: {
        fr: 'Ajouter locataire',
        en: 'Add Tenant'
      },
      addTenantDesc: {
        fr: 'Enregistrer un locataire',
        en: 'Register a tenant'
      },
      propertyInspection: {
        fr: 'État des lieux',
        en: 'Property Inspection'
      },
      propertyInspectionDesc: {
        fr: 'Programmer une visite',
        en: 'Schedule a visit'
      },
      propertyInspectionPreview: {
        fr: 'Inspections des propriétés',
        en: 'Property inspections'
      },
      forecasting: {
        fr: 'Prévisions financières',
        en: 'Financial Forecasting'
      },
      forecastingDesc: {
        fr: 'Projections de revenus',
        en: 'Revenue projections'
      },
      forecastingPreview: {
        fr: 'Projections de revenus',
        en: 'Revenue projections'
      },
      maintenance: {
        fr: 'Maintenance',
        en: 'Maintenance'
      },
      maintenanceDesc: {
        fr: 'Demande d\'intervention',
        en: 'Service request'
      },
      maintenancePreview: {
        fr: '1 demande urgente',
        en: '1 urgent request'
      },
      messages: {
        fr: 'Messages',
        en: 'Messages'
      },
      messagesDesc: {
        fr: 'Discuter avec les locataires',
        en: 'Chat with tenants'
      },
      messagesPreview: {
        fr: 'Centre de communication',
        en: 'Communication center'
      },
      taxes: {
        fr: 'Gestion fiscale',
        en: 'Tax Management'
      },
      taxesDesc: {
        fr: 'Déclarations fiscales',
        en: 'Tax declarations'
      },
      taxesPreview: {
        fr: 'Déclarations fiscales',
        en: 'Tax declarations'
      },
      charges: {
        fr: 'Calculer charges',
        en: 'Calculate Charges'
      },
      chargesDesc: {
        fr: 'Révision annuelle',
        en: 'Annual review'
      },
      chargesPreview: {
        fr: '0 paiements en attente',
        en: '0 pending payments'
      },
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
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || fallback;
  };

  return [
    {
      id: 'dashboard',
      title: getLocalizedText('dashboard'),
      description: getLocalizedText('dashboardDesc'),
      icon: LayoutDashboard,
      color: 'bg-slate-500',
      action: () => {
        console.log('Showing dashboard view');
        setActiveView('dashboard');
      },
      preview: getLocalizedText('dashboardPreview'),
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
