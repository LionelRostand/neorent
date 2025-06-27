
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useSidebarMenuItems } from '@/components/Layout/SidebarComponents/useSidebarMenuItems';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';

interface AvailableMenusSectionProps {
  quickActions: QuickActionConfig[];
  onAddMenuToQuickActions: (menuItem: any) => Promise<void>;
  addingMenus: Record<string, boolean>;
  saving: boolean;
}

const AvailableMenusSection: React.FC<AvailableMenusSectionProps> = ({
  quickActions,
  onAddMenuToQuickActions,
  addingMenus,
  saving
}) => {
  const { i18n } = useTranslation();
  const sidebarMenuItems = useSidebarMenuItems();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      availableMenus: {
        fr: 'Menus disponibles du sidebar',
        en: 'Available sidebar menus'
      },
      addButton: {
        fr: 'Ajouter',
        en: 'Add'
      },
      noMenusAvailable: {
        fr: 'Tous les menus du sidebar ont déjà été ajoutés aux actions rapides',
        en: 'All sidebar menus have already been added to quick actions'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const getColorForMenu = (path: string): string => {
    const colorMap: Record<string, string> = {
      '/admin/dashboard': 'bg-slate-500',
      '/admin/properties': 'bg-blue-500',
      '/admin/tenants': 'bg-purple-500',
      '/admin/roommates': 'bg-pink-500',
      '/admin/contracts': 'bg-yellow-500',
      '/admin/inspections': 'bg-orange-500',
      '/admin/rent-management': 'bg-green-500',
      '/admin/rental-charges': 'bg-teal-500',
      '/admin/forecasting': 'bg-emerald-500',
      '/admin/maintenance': 'bg-red-500',
      '/admin/messages': 'bg-indigo-500',
      '/admin/taxes': 'bg-cyan-500',
      '/admin/website': 'bg-violet-500',
      '/admin/settings': 'bg-gray-500',
      '/admin/help': 'bg-amber-500'
    };
    return colorMap[path] || 'bg-gray-500';
  };

  const isMenuAlreadyAdded = (menuPath: string): boolean => {
    const menuId = menuPath.replace('/admin/', '');
    return quickActions.some(action => action.id === menuId || action.actionValue === menuPath);
  };

  const getAvailableMenus = () => {
    return sidebarMenuItems.filter(menu => !isMenuAlreadyAdded(menu.path));
  };

  const availableMenus = getAvailableMenus();

  // Get localized label for menu item
  const getMenuLabel = (menuItem: any) => {
    const currentLang = i18n.language;
    
    // Menu translations
    const menuTranslations: Record<string, Record<string, string>> = {
      'Tableau de bord': {
        fr: 'Tableau de bord',
        en: 'Dashboard'
      },
      'Propriétés': {
        fr: 'Propriétés',
        en: 'Properties'
      },
      'Locataires': {
        fr: 'Locataires',
        en: 'Tenants'
      },
      'Colocataires': {
        fr: 'Colocataires',
        en: 'Roommates'
      },
      'Contrats': {
        fr: 'Contrats',
        en: 'Contracts'
      },
      'Inspections': {
        fr: 'Inspections',
        en: 'Inspections'
      },
      'Gestion des loyers': {
        fr: 'Gestion des loyers',
        en: 'Rent Management'
      },
      'Charges locatives': {
        fr: 'Charges locatives',
        en: 'Rental Charges'
      },
      'Prévisions': {
        fr: 'Prévisions',
        en: 'Forecasting'
      },
      'Maintenance': {
        fr: 'Maintenance',
        en: 'Maintenance'
      },
      'Messages': {
        fr: 'Messages',
        en: 'Messages'
      },
      'Fiscalité': {
        fr: 'Fiscalité',
        en: 'Tax Management'
      },
      'Site web': {
        fr: 'Site web',
        en: 'Website'
      },
      'Paramètres': {
        fr: 'Paramètres',
        en: 'Settings'
      },
      'Aide': {
        fr: 'Aide',
        en: 'Help'
      }
    };

    return menuTranslations[menuItem.label]?.[currentLang] || menuItem.label;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg font-semibold">{getLocalizedText('availableMenus')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableMenus.map((menuItem) => {
            const Icon = menuItem.icon;
            const isAdding = addingMenus[menuItem.path];
            
            return (
              <div key={menuItem.path} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded ${getColorForMenu(menuItem.path)} flex-shrink-0`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{getMenuLabel(menuItem)}</div>
                  <div className="text-xs text-gray-500 truncate">{menuItem.path}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAddMenuToQuickActions(menuItem)}
                  disabled={isAdding || saving}
                  className="flex-shrink-0"
                >
                  {isAdding && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  <Plus className="h-3 w-3 mr-1" />
                  {getLocalizedText('addButton')}
                </Button>
              </div>
            );
          })}
          {availableMenus.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p className="text-sm">{getLocalizedText('noMenusAvailable')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableMenusSection;
