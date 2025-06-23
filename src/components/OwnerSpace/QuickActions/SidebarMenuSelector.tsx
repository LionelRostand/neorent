
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  FileText, 
  Home, 
  Calculator, 
  Wrench, 
  MessageSquare,
  TrendingUp,
  CreditCard,
  Settings,
  HelpCircle,
  Globe,
  Building2,
  UserCog,
  Bell
} from 'lucide-react';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';

interface SidebarMenuSelectorProps {
  onClose: () => void;
  onMenuSelect: (menuItem: any) => void;
}

const SidebarMenuSelector: React.FC<SidebarMenuSelectorProps> = ({ onClose, onMenuSelect }) => {
  const { i18n } = useTranslation();
  const { addCustomAction } = useQuickActionsManager();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      selectMenu: {
        fr: 'Sélectionner un menu',
        en: 'Select a Menu'
      },
      selectMenuDesc: {
        fr: 'Choisissez un menu de la sidebar à ajouter aux actions rapides',
        en: 'Choose a sidebar menu to add to quick actions'
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      },
      dashboard: {
        fr: 'Tableau de bord',
        en: 'Dashboard'
      },
      properties: {
        fr: 'Propriétés',
        en: 'Properties'
      },
      tenants: {
        fr: 'Locataires',
        en: 'Tenants'
      },
      contracts: {
        fr: 'Contrats',
        en: 'Contracts'
      },
      inspections: {
        fr: 'Inspections',
        en: 'Inspections'
      },
      charges: {
        fr: 'Charges locatives',
        en: 'Rental Charges'
      },
      maintenance: {
        fr: 'Maintenance',
        en: 'Maintenance'
      },
      messages: {
        fr: 'Messages',
        en: 'Messages'
      },
      forecasting: {
        fr: 'Prévisions',
        en: 'Forecasting'
      },
      payments: {
        fr: 'Paiements',
        en: 'Payments'
      },
      settings: {
        fr: 'Paramètres',
        en: 'Settings'
      },
      help: {
        fr: 'Aide',
        en: 'Help'
      },
      website: {
        fr: 'Site web',
        en: 'Website'
      },
      companies: {
        fr: 'Entreprises',
        en: 'Companies'
      },
      users: {
        fr: 'Utilisateurs',
        en: 'Users'
      },
      notifications: {
        fr: 'Notifications',
        en: 'Notifications'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Menus disponibles dans la sidebar
  const sidebarMenus = [
    {
      id: 'dashboard',
      title: { fr: getLocalizedText('dashboard'), en: 'Dashboard' },
      description: { fr: 'Vue d\'ensemble du système', en: 'System overview' },
      icon: 'LayoutDashboard',
      color: 'bg-slate-500',
      route: '/admin/dashboard'
    },
    {
      id: 'properties',
      title: { fr: getLocalizedText('properties'), en: 'Properties' },
      description: { fr: 'Gestion des propriétés', en: 'Property management' },
      icon: 'Building',
      color: 'bg-blue-500',
      route: '/admin/properties'
    },
    {
      id: 'tenants',
      title: { fr: getLocalizedText('tenants'), en: 'Tenants' },
      description: { fr: 'Gestion des locataires', en: 'Tenant management' },
      icon: 'Users',
      color: 'bg-purple-500',
      route: '/admin/tenants'
    },
    {
      id: 'contracts',
      title: { fr: getLocalizedText('contracts'), en: 'Contracts' },
      description: { fr: 'Gestion des contrats', en: 'Contract management' },
      icon: 'FileText',
      color: 'bg-yellow-500',
      route: '/admin/contracts'
    },
    {
      id: 'inspections',
      title: { fr: getLocalizedText('inspections'), en: 'Inspections' },
      description: { fr: 'États des lieux', en: 'Property inspections' },
      icon: 'Home',
      color: 'bg-orange-500',
      route: '/admin/inspections'
    },
    {
      id: 'charges',
      title: { fr: getLocalizedText('charges'), en: 'Rental Charges' },
      description: { fr: 'Charges locatives', en: 'Rental charges management' },
      icon: 'Calculator',
      color: 'bg-teal-500',
      route: '/admin/rental-charges'
    },
    {
      id: 'maintenance',
      title: { fr: getLocalizedText('maintenance'), en: 'Maintenance' },
      description: { fr: 'Demandes de maintenance', en: 'Maintenance requests' },
      icon: 'Wrench',
      color: 'bg-red-500',
      route: '/admin/maintenance'
    },
    {
      id: 'messages',
      title: { fr: getLocalizedText('messages'), en: 'Messages' },
      description: { fr: 'Communication', en: 'Communication center' },
      icon: 'MessageSquare',
      color: 'bg-indigo-500',
      route: '/admin/messages'
    },
    {
      id: 'forecasting',
      title: { fr: getLocalizedText('forecasting'), en: 'Forecasting' },
      description: { fr: 'Prévisions financières', en: 'Financial forecasting' },
      icon: 'TrendingUp',
      color: 'bg-emerald-500',
      route: '/admin/forecasting'
    },
    {
      id: 'payments',
      title: { fr: getLocalizedText('payments'), en: 'Payments' },
      description: { fr: 'Gestion des paiements', en: 'Payment management' },
      icon: 'CreditCard',
      color: 'bg-cyan-500',
      route: '/admin/rent-management'
    }
  ];

  const iconMap: Record<string, any> = {
    LayoutDashboard,
    Building,
    Users,
    FileText,
    Home,
    Calculator,
    Wrench,
    MessageSquare,
    TrendingUp,
    CreditCard,
    Settings,
    HelpCircle,
    Globe,
    Building2,
    UserCog,
    Bell
  };

  const handleMenuSelect = async (menu: any) => {
    try {
      const newAction = {
        id: `sidebar_${menu.id}_${Date.now()}`,
        title: menu.title,
        description: menu.description,
        icon: menu.icon,
        color: menu.color,
        enabled: true,
        action: 'navigate' as const,
        actionValue: menu.route
      };

      await addCustomAction(newAction);
      onMenuSelect(newAction);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du menu:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getLocalizedText('selectMenu')}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            {getLocalizedText('selectMenuDesc')}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {sidebarMenus.map((menu) => {
            const Icon = iconMap[menu.icon] || LayoutDashboard;
            
            return (
              <button
                key={menu.id}
                onClick={() => handleMenuSelect(menu)}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <div className={`p-2 rounded ${menu.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {menu.title[i18n.language as 'fr' | 'en'] || menu.title.fr}
                  </div>
                  <div className="text-xs text-gray-500">
                    {menu.description[i18n.language as 'fr' | 'en'] || menu.description.fr}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            {getLocalizedText('cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarMenuSelector;
