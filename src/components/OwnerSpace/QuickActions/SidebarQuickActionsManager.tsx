import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Loader2 } from 'lucide-react';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useToast } from '@/hooks/use-toast';
import { getIconNameForPath } from '@/utils/menuIconMapping';
import CurrentActionsSection from './CurrentActionsSection';
import AvailableMenusSection from './AvailableMenusSection';

const SidebarQuickActionsManager: React.FC = () => {
  const { t } = useTranslation();
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

  const handleToggleAction = async (actionId: string) => {
    if (!isAdmin) {
      toast({
        title: t('quickActions.manager.notAuthorized'),
        description: t('quickActions.manager.adminRequired'),
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
          title: t('quickActions.manager.actionToggled'),
          description: t('quickActions.manager.actionEnabledDisabled'),
        });
      } else {
        throw new Error('Toggle failed');
      }
    } catch (error) {
      console.error('Error toggling action:', error);
      toast({
        title: t('quickActions.manager.error'),
        description: t('quickActions.manager.toggleError'),
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
        title: t('quickActions.manager.notAuthorized'),
        description: t('quickActions.manager.adminRequired'),
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
          title: t('quickActions.manager.actionRemoved'),
          description: t('quickActions.manager.actionRemovedSuccess'),
        });
        return true;
      } else {
        throw new Error('Remove failed');
      }
    } catch (error) {
      console.error('Error removing action:', error);
      toast({
        title: t('quickActions.manager.error'),
        description: t('quickActions.manager.removeError'),
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
        title: t('quickActions.manager.notAuthorized'),
        description: t('quickActions.manager.adminRequired'),
        variant: "destructive",
      });
      return;
    }

    const menuPath = menuItem.path;
    setAddingMenus(prev => ({ ...prev, [menuPath]: true }));
    setSaving(true);

    try {
      console.log('Adding menu to quick actions:', menuItem);
      
      const menuName = menuPath.replace('/admin/', '').replace('-', '');
      
      const newAction = {
        id: menuPath.replace('/admin/', ''),
        titleKey: `quickActions.${menuName}.title`,
        descriptionKey: `quickActions.${menuName}.description`,
        icon: getIconNameForPath(menuPath),
        color: getColorForMenu(menuPath),
        enabled: true,
        action: 'navigate' as const,
        actionValue: menuPath
      };

      const success = await addCustomAction(newAction);
      
      if (success) {
        toast({
          title: t('quickActions.manager.menuAdded'),
          description: t('quickActions.manager.menuAddedSuccess'),
        });
      } else {
        throw new Error('Add failed');
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      toast({
        title: t('quickActions.manager.error'),
        description: t('quickActions.manager.addMenuError'),
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
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm py-2 px-2 sm:px-3 font-medium"
        >
          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate text-xs sm:text-sm">{t('quickActions.manager.title')}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {t('quickActions.manager.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="space-y-4 sm:space-y-6">
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
        </div>

        <div className="flex justify-end px-4 sm:px-6 py-4 border-t flex-shrink-0 bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={saving}
            className="text-sm"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t('quickActions.manager.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarQuickActionsManager;
