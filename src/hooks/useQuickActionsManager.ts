import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export interface QuickActionConfig {
  id: string;
  titleKey: string; // Changed to use translation keys
  descriptionKey: string; // Changed to use translation keys
  icon: string;
  color: string;
  enabled: boolean;
  order: number;
  action: string;
  actionValue: string;
  hiddenFromSidebar?: boolean;
}

export const defaultQuickActions: QuickActionConfig[] = [
  {
    id: 'dashboard',
    titleKey: 'quickActions.dashboard.title',
    descriptionKey: 'quickActions.dashboard.description',
    icon: 'LayoutDashboard',
    color: 'bg-slate-500',
    enabled: true,
    order: 1,
    action: 'dialog',
    actionValue: 'dashboard'
  },
  {
    id: 'property',
    titleKey: 'quickActions.property.title',
    descriptionKey: 'quickActions.property.description',
    icon: 'Plus',
    color: 'bg-blue-500',
    enabled: true,
    order: 2,
    action: 'dialog',
    actionValue: 'property'
  },
  {
    id: 'contract',
    titleKey: 'quickActions.contract.title',
    descriptionKey: 'quickActions.contract.description',
    icon: 'FileText',
    color: 'bg-yellow-500',
    enabled: true,
    order: 3,
    action: 'dialog',
    actionValue: 'contract'
  },
  {
    id: 'roommate',
    titleKey: 'quickActions.roommate.title',
    descriptionKey: 'quickActions.roommate.description',
    icon: 'Users',
    color: 'bg-purple-500',
    enabled: true,
    order: 4,
    action: 'dialog',
    actionValue: 'roommate'
  },
  {
    id: 'website',
    titleKey: 'quickActions.website.title',
    descriptionKey: 'quickActions.website.description',
    icon: 'Globe',
    color: 'bg-violet-500',
    enabled: true,
    order: 5,
    action: 'navigate',
    actionValue: '/admin/website'
  },
  {
    id: 'settings',
    titleKey: 'quickActions.settings.title',
    descriptionKey: 'quickActions.settings.description',
    icon: 'Settings',
    color: 'bg-gray-500',
    enabled: true,
    order: 6,
    action: 'navigate',
    actionValue: '/admin/settings'
  }
];

export const useQuickActionsManager = () => {
  const { userType, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [quickActions, setQuickActions] = useState<QuickActionConfig[]>(defaultQuickActions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = userType === 'admin' || user?.email === 'admin@neotech-consulting.com';

  useEffect(() => {
    loadQuickActions();
  }, [user]);

  const loadQuickActions = async () => {
    try {
      console.log('Loading quick actions from Firebase...');
      
      if (!user) {
        console.log('No user, using default actions');
        setQuickActions(defaultQuickActions);
        setLoading(false);
        return;
      }

      const configDoc = await getDoc(doc(db, 'system_config', 'quick_actions'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        console.log('Loaded quick actions from Firebase:', data.actions);
        setQuickActions(data.actions || defaultQuickActions);
      } else {
        console.log('No quick actions found in Firebase, using default and saving them');
        setQuickActions(defaultQuickActions);
        // Sauvegarder les actions par défaut pour les futures utilisations
        if (isAdmin) {
          await setDoc(doc(db, 'system_config', 'quick_actions'), {
            actions: defaultQuickActions,
            updatedAt: new Date().toISOString(),
            updatedBy: user.uid
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error loading quick actions:', error);
      setQuickActions(defaultQuickActions);
    } finally {
      setLoading(false);
    }
  };

  const saveQuickActions = async (actions: QuickActionConfig[]) => {
    if (!isAdmin) {
      console.error('User is not admin, cannot save quick actions');
      return false;
    }

    if (!user) {
      console.error('No user found');
      return false;
    }

    setSaving(true);
    try {
      console.log('Saving quick actions to Firebase:', actions);
      
      await setDoc(doc(db, 'system_config', 'quick_actions'), {
        actions: actions,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      }, { merge: true });

      setQuickActions(actions);
      setRefreshKey(Date.now());
      
      console.log('Quick actions saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving quick actions:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleAction = async (actionId: string) => {
    if (!isAdmin) {
      console.error('User is not admin, cannot toggle action');
      return false;
    }

    console.log('Toggling action:', actionId);
    
    const updatedActions = quickActions.map(action =>
      action.id === actionId ? { ...action, enabled: !action.enabled } : action
    );
    
    const success = await saveQuickActions(updatedActions);
    return success;
  };

  const removeAction = async (actionId: string) => {
    if (!isAdmin) {
      console.error('User is not admin, cannot remove action');
      return false;
    }

    console.log('Removing action:', actionId);
    
    const updatedActions = quickActions.filter(action => action.id !== actionId);
    const reorderedActions = updatedActions.map((action, index) => ({
      ...action,
      order: index + 1
    }));
    
    const success = await saveQuickActions(reorderedActions);
    return success;
  };

  const updateAction = async (updatedAction: QuickActionConfig) => {
    if (!isAdmin) {
      console.error('User is not admin, cannot update action');
      return false;
    }

    console.log('Updating action:', updatedAction);
    
    const updatedActions = quickActions.map(action =>
      action.id === updatedAction.id ? updatedAction : action
    );
    
    const success = await saveQuickActions(updatedActions);
    return success;
  };

  const addCustomAction = async (newAction: Omit<QuickActionConfig, 'order'>) => {
    if (!isAdmin) {
      console.error('User is not admin, cannot add action');
      return false;
    }

    console.log('Adding custom action:', newAction);
    
    // Check if action already exists
    const existingAction = quickActions.find(action => 
      action.id === newAction.id || action.actionValue === newAction.actionValue
    );
    
    if (existingAction) {
      console.log('Action already exists, not adding');
      return false;
    }
    
    const actionWithOrder = {
      ...newAction,
      order: quickActions.length + 1
    };
    const updatedActions = [...quickActions, actionWithOrder];
    
    const success = await saveQuickActions(updatedActions);
    return success;
  };

  const getLocalizedAction = (action: QuickActionConfig) => {
    return {
      ...action,
      title: t(action.titleKey, action.titleKey),
      description: t(action.descriptionKey, action.descriptionKey)
    };
  };

  const getEnabledActions = () => {
    const enabledActions = quickActions
      .filter(action => action.enabled === true)
      .sort((a, b) => a.order - b.order)
      .map(action => getLocalizedAction(action));
    
    console.log('Getting enabled actions with translations:', enabledActions);
    return enabledActions;
  };

  return {
    quickActions,
    loading,
    saving,
    isAdmin,
    toggleAction,
    updateAction,
    reorderActions: async (dragIndex: number, hoverIndex: number) => {
      const dragAction = quickActions[dragIndex];
      const updatedActions = [...quickActions];
      updatedActions.splice(dragIndex, 1);
      updatedActions.splice(hoverIndex, 0, dragAction);
      
      const reorderedActions = updatedActions.map((action, index) => ({
        ...action,
        order: index + 1
      }));
      
      return await saveQuickActions(reorderedActions);
    },
    addCustomAction,
    removeAction,
    getEnabledActions,
    refreshKey,
    getLocalizedAction
  };
};
