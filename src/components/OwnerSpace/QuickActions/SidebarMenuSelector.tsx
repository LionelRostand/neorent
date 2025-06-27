
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, X } from 'lucide-react';
import { useSidebarMenuItems } from '@/components/Layout/SidebarComponents/useSidebarMenuItems';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';

interface SidebarMenuSelectorProps {
  onClose: () => void;
  onMenuSelect: (menuItem: any) => void;
}

const SidebarMenuSelector: React.FC<SidebarMenuSelectorProps> = ({ 
  onClose, 
  onMenuSelect 
}) => {
  const { i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const sidebarMenuItems = useSidebarMenuItems();
  const { quickActions, addCustomAction } = useQuickActionsManager();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      selectMenu: {
        fr: 'Sélectionner un menu',
        en: 'Select a menu'
      },
      search: {
        fr: 'Rechercher...',
        en: 'Search...'
      },
      add: {
        fr: 'Ajouter',
        en: 'Add'
      },
      close: {
        fr: 'Fermer',
        en: 'Close'
      },
      alreadyAdded: {
        fr: 'Déjà ajouté',
        en: 'Already added'
      },
      noResults: {
        fr: 'Aucun résultat trouvé',
        en: 'No results found'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Menu translations
  const getMenuLabel = (menuItem: any) => {
    const currentLang = i18n.language;
    
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

    return menuTranslations[menuItem.title]?.[currentLang] || menuItem.title;
  };

  const getColorForMenu = (url: string): string => {
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
    return colorMap[url] || 'bg-gray-500';
  };

  const isMenuAlreadyAdded = (menuUrl: string): boolean => {
    const menuId = menuUrl.replace('/admin/', '');
    return quickActions.some(action => action.id === menuId || action.actionValue === menuUrl);
  };

  const filteredMenus = sidebarMenuItems.filter(menu => 
    getMenuLabel(menu).toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMenu = async (menuItem: any) => {
    const newAction = {
      id: menuItem.url.replace('/admin/', ''),
      title: {
        fr: menuItem.title,
        en: getMenuLabel(menuItem)
      },
      description: {
        fr: `Accéder à ${menuItem.title}`,
        en: `Access ${getMenuLabel(menuItem)}`
      },
      icon: menuItem.icon?.name || 'Settings',
      color: getColorForMenu(menuItem.url),
      enabled: true,
      action: 'navigate' as const,
      actionValue: menuItem.url
    };

    await addCustomAction(newAction);
    onMenuSelect(menuItem);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {getLocalizedText('selectMenu')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={getLocalizedText('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMenus.map((menuItem) => {
                const Icon = menuItem.icon;
                const isAlreadyAdded = isMenuAlreadyAdded(menuItem.url);
                
                return (
                  <Card key={menuItem.url} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${getColorForMenu(menuItem.url)} flex-shrink-0`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {getMenuLabel(menuItem)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {menuItem.url}
                          </div>
                          {isAlreadyAdded && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {getLocalizedText('alreadyAdded')}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddMenu(menuItem)}
                          disabled={isAlreadyAdded}
                          className="flex-shrink-0"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {getLocalizedText('add')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredMenus.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p className="text-sm">{getLocalizedText('noResults')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {getLocalizedText('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarMenuSelector;
