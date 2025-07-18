import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Loader2 } from 'lucide-react';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useToast } from '@/hooks/use-toast';
import CurrentActionsSection from './CurrentActionsSection';
import AvailableMenusSection from './AvailableMenusSection';

const SidebarQuickActionsManager: React.FC = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingMenus, setAddingMenus] = useState<Record<string, boolean>>({});
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  
  const {
    quickActions,
    toggleAction,
    removeAction,
    addCustomAction,
    isAdmin
  } = useQuickActionsManager();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      manageActions: {
        fr: 'Gérer les actions',
        en: 'Manage Actions'
      },
      quickActionsManager: {
        fr: 'Gestionnaire d\'actions rapides',
        en: 'Quick Actions Manager'
      },
      close: {
        fr: 'Fermer',
        en: 'Close'
      },
      actionToggled: {
        fr: 'Action basculée',
        en: 'Action Toggled'
      },
      actionEnabledDisabled: {
        fr: 'L\'action a été activée/désactivée avec succès.',
        en: 'The action has been enabled/disabled successfully.'
      },
      error: {
        fr: 'Erreur',
        en: 'Error'
      },
      toggleError: {
        fr: 'Erreur lors du basculement de l\'action.',
        en: 'Error toggling the action.'
      },
      actionRemoved: {
        fr: 'Action supprimée',
        en: 'Action Removed'
      },
      actionRemovedSuccess: {
        fr: 'L\'action a été supprimée avec succès.',
        en: 'The action has been removed successfully.'
      },
      removeError: {
        fr: 'Erreur lors de la suppression de l\'action.',
        en: 'Error removing the action.'
      },
      menuAdded: {
        fr: 'Menu ajouté',
        en: 'Menu Added'
      },
      menuAddedSuccess: {
        fr: 'Le menu a été ajouté aux actions rapides avec succès.',
        en: 'The menu has been added to quick actions successfully.'
      },
      addMenuError: {
        fr: 'Erreur lors de l\'ajout du menu.',
        en: 'Error adding the menu.'
      },
      notAuthorized: {
        fr: 'Non autorisé',
        en: 'Not Authorized'
      },
      adminRequired: {
        fr: 'Seuls les administrateurs peuvent gérer les actions rapides.',
        en: 'Only administrators can manage quick actions.'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleToggleAction = async (actionId: string) => {
    if (!isAdmin) {
      toast({
        title: getLocalizedText('notAuthorized'),
        description: getLocalizedText('adminRequired'),
        variant: "destructive",
      });
      return;
    }

    setToggleStates(prev => ({ ...prev, [actionId]: true }));
    setSaving(true);
    
    try {
      console.log('Toggling action:', actionId);
      const success = await toggleAction(actionId);
      
      if (success) {
        toast({
          title: getLocalizedText('actionToggled'),
          description: getLocalizedText('actionEnabledDisabled'),
        });
      } else {
        throw new Error('Toggle failed');
      }
    } catch (error) {
      console.error('Error toggling action:', error);
      toast({
        title: getLocalizedText('error'),
        description: getLocalizedText('toggleError'),
        variant: "destructive",
      });
    } finally {
      setToggleStates(prev => ({ ...prev, [actionId]: false }));
      setSaving(false);
    }
  };

  const handleRemoveAction = async (actionId: string): Promise<boolean> => {
    if (!isAdmin) {
      toast({
        title: getLocalizedText('notAuthorized'),
        description: getLocalizedText('adminRequired'),
        variant: "destructive",
      });
      return false;
    }

    setSaving(true);
    
    try {
      console.log('Removing action:', actionId);
      const success = await removeAction(actionId);
      
      if (success) {
        toast({
          title: getLocalizedText('actionRemoved'),
          description: getLocalizedText('actionRemovedSuccess'),
        });
        return true;
      } else {
        throw new Error('Remove failed');
      }
    } catch (error) {
      console.error('Error removing action:', error);
      toast({
        title: getLocalizedText('error'),
        description: getLocalizedText('removeError'),
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddMenuToQuickActions = async (menuItem: any) => {
    if (!isAdmin) {
      toast({
        title: getLocalizedText('notAuthorized'),
        description: getLocalizedText('adminRequired'),
        variant: "destructive",
      });
      return;
    }

    const menuPath = menuItem.path;
    setAddingMenus(prev => ({ ...prev, [menuPath]: true }));
    setSaving(true);

    try {
      console.log('Adding menu to quick actions:', menuItem);
      
      const newAction = {
        id: menuPath.replace('/admin/', ''),
        titleKey: `quickActions.${menuItem.label.toLowerCase()}.title`,
        descriptionKey: `quickActions.${menuItem.label.toLowerCase()}.description`,
        icon: menuItem.icon?.name || 'Settings',
        color: getColorForMenu(menuPath),
        enabled: true,
        action: 'navigate' as const,
        actionValue: menuPath
      };

      const success = await addCustomAction(newAction);
      
      if (success) {
        toast({
          title: getLocalizedText('menuAdded'),
          description: getLocalizedText('menuAddedSuccess'),
        });
      } else {
        throw new Error('Add failed');
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      toast({
        title: getLocalizedText('error'),
        description: getLocalizedText('addMenuError'),
        variant: "destructive",
      });
    } finally {
      setAddingMenus(prev => ({ ...prev, [menuPath]: false }));
      setSaving(false);
    }
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

  const handleConfigureAction = (actionId: string) => {
    console.log('Configure action:', actionId);
    // TODO: Implement configuration logic
  };

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm py-2 px-3 font-medium"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="truncate">{getLocalizedText('manageActions')}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {getLocalizedText('quickActionsManager')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <CurrentActionsSection
            quickActions={quickActions}
            onToggleAction={handleToggleAction}
            onRemoveAction={handleRemoveAction}
            onConfigureAction={handleConfigureAction}
            toggleStates={toggleStates}
            saving={saving}
          />
          
          <AvailableMenusSection
            quickActions={quickActions}
            onAddMenuToQuickActions={handleAddMenuToQuickActions}
            addingMenus={addingMenus}
            saving={saving}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={saving}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {getLocalizedText('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarQuickActionsManager;
