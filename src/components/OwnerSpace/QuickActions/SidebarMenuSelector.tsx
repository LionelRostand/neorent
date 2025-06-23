
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
  const { t, i18n } = useTranslation();
  const { addCustomAction, quickActions } = useQuickActionsManager();

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
      noMenusAvailable: {
        fr: 'Aucun menu disponible',
        en: 'No menus available'
      },
      allMenusAdded: {
        fr: 'Tous les menus de la sidebar ont déjà été ajoutés aux actions rapides.',
        en: 'All sidebar menus have already been added to quick actions.'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Menus disponibles dans la sidebar
  const allSidebarMenus = [
    {
      id: 'dashboard',
      title: { fr: t('navigation.dashboard', 'Tableau de bord'), en: 'Dashboard' },
      description: { fr: 'Vue d\'ensemble du système', en: 'System overview' },
      icon: 'LayoutDashboard',
      color: 'bg-slate-500',
      route: '/admin/dashboard'
    },
    {
      id: 'properties',
      title: { fr: t('navigation.properties', 'Propriétés'), en: 'Properties' },
      description: { fr: 'Gestion des propriétés', en: 'Property management' },
      icon: 'Building',
      color: 'bg-blue-500',
      route: '/admin/properties'
    },
    {
      id: 'tenants',
      title: { fr: t('navigation.tenants', 'Locataires'), en: 'Tenants' },
      description: { fr: 'Gestion des locataires', en: 'Tenant management' },
      icon: 'Users',
      color: 'bg-purple-500',
      route: '/admin/tenants'
    },
    {
      id: 'contracts',
      title: { fr: t('navigation.contracts', 'Contrats'), en: 'Contracts' },
      description: { fr: 'Gestion des contrats', en: 'Contract management' },
      icon: 'FileText',
      color: 'bg-yellow-500',
      route: '/admin/contracts'
    },
    {
      id: 'inspections',
      title: { fr: t('navigation.inspections', 'Inspections'), en: 'Inspections' },
      description: { fr: 'États des lieux', en: 'Property inspections' },
      icon: 'Home',
      color: 'bg-orange-500',
      route: '/admin/inspections'
    },
    {
      id: 'charges',
      title: { fr: t('navigation.rentalCharges', 'Charges locatives'), en: 'Rental Charges' },
      description: { fr: 'Charges locatives', en: 'Rental charges management' },
      icon: 'Calculator',
      color: 'bg-teal-500',
      route: '/admin/rental-charges'
    },
    {
      id: 'maintenance',
      title: { fr: t('navigation.maintenance', 'Maintenance'), en: 'Maintenance' },
      description: { fr: 'Demandes de maintenance', en: 'Maintenance requests' },
      icon: 'Wrench',
      color: 'bg-red-500',
      route: '/admin/maintenance'
    },
    {
      id: 'messages',
      title: { fr: t('navigation.messages', 'Messages'), en: 'Messages' },
      description: { fr: 'Communication', en: 'Communication center' },
      icon: 'MessageSquare',
      color: 'bg-indigo-500',
      route: '/admin/messages'
    },
    {
      id: 'forecasting',
      title: { fr: t('navigation.forecasting', 'Prévisions'), en: 'Forecasting' },
      description: { fr: 'Prévisions financières', en: 'Financial forecasting' },
      icon: 'TrendingUp',
      color: 'bg-emerald-500',
      route: '/admin/forecasting'
    },
    {
      id: 'payments',
      title: { fr: t('navigation.rentManagement', 'Paiements'), en: 'Payments' },
      description: { fr: 'Gestion des paiements', en: 'Payment management' },
      icon: 'CreditCard',
      color: 'bg-cyan-500',
      route: '/admin/rent-management'
    },
    {
      id: 'taxes',
      title: { fr: t('navigation.taxes', 'Taxes'), en: 'Taxes' },
      description: { fr: 'Gestion fiscale', en: 'Tax management' },
      icon: 'FileText',
      color: 'bg-pink-500',
      route: '/admin/taxes'
    },
    {
      id: 'settings',
      title: { fr: t('navigation.settings', 'Paramètres'), en: 'Settings' },
      description: { fr: 'Configuration du système', en: 'System configuration' },
      icon: 'Settings',
      color: 'bg-gray-500',
      route: '/admin/settings'
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

  // Filtrer les menus qui ne sont pas déjà présents dans les actions rapides
  const existingMenuIds = quickActions.map(action => action.id);
  const availableMenus = allSidebarMenus.filter(menu => !existingMenuIds.includes(menu.id));

  const handleMenuSelect = async (menu: any) => {
    try {
      const newAction = {
        id: menu.id,
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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{getLocalizedText('selectMenu')}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            {getLocalizedText('selectMenuDesc')}
          </p>
        </DialogHeader>

        {availableMenus.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">{getLocalizedText('noMenusAvailable')}</p>
            <p className="text-sm text-gray-400">{getLocalizedText('allMenusAdded')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {availableMenus.map((menu) => {
              const Icon = iconMap[menu.icon] || LayoutDashboard;
              
              return (
                <button
                  key={menu.id}
                  onClick={() => handleMenuSelect(menu)}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors w-full"
                >
                  <div className={`p-2 rounded ${menu.color} flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {menu.title[i18n.language as 'fr' | 'en'] || menu.title.fr}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {menu.description[i18n.language as 'fr' | 'en'] || menu.description.fr}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

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
