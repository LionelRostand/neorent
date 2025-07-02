
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

const QuickActionsManager: React.FC = () => {
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
    addCustomAction
  } = useQuickActionsManager();

  const handleToggleAction = async (actionId: string) => {
    setToggleStates(prev => ({ ...prev, [actionId]: true }));
    setSaving(true);
    
    try {
      await toggleAction(actionId);
      toast({
        title: t('quickActions.manager.actionToggled'),
        description: t('quickActions.manager.actionEnabledDisabled'),
      });
    } catch (error) {
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
    setSaving(true);
    
    try {
      const success = await removeAction(actionId);
      if (success) {
        toast({
          title: t('quickActions.manager.actionRemoved'),
          description: t('quickActions.manager.actionRemovedSuccess'),
        });
        return true;
      }
      return false;
    } catch (error) {
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
    const menuPath = menuItem.path;
    setAddingMenus(prev => ({ ...prev, [menuPath]: true }));
    setSaving(true);

    try {
      // Extract the menu name from the path for translation key
      const menuName = menuPath.replace('/admin/', '').replace('-', '');
      
      const newAction = {
        id: menuPath.replace('/admin/', ''),
        titleKey: `quickActions.${menuName}.title`,
        descriptionKey: `quickActions.${menuName}.description`,
        icon: getIconNameForPath(menuPath), // Use the icon mapping
        color: getColorForMenu(menuPath),
        enabled: true,
        action: 'navigate' as const,
        actionValue: menuPath
      };

      await addCustomAction(newAction);
      
      toast({
        title: t('quickActions.manager.menuAdded'),
        description: t('quickActions.manager.menuAddedSuccess'),
      });
    } catch (error) {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-green-500 hover:bg-green-600 text-white border-green-400 text-xs md:text-sm py-2 px-3"
        >
          <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="truncate">{t('quickActions.manager.title')}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('quickActions.manager.title')}
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
            {t('quickActions.manager.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionsManager;
