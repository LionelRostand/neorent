
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface QuickActionConfig {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: string;
  color: string;
  enabled: boolean;
  order: number;
  action: string; // action type like 'navigate' or 'dialog'
  actionValue: string; // route or dialog name
}

export const defaultQuickActions: QuickActionConfig[] = [
  {
    id: 'dashboard',
    title: { fr: 'Tableau de bord', en: 'Dashboard' },
    description: { fr: 'Vue d\'ensemble', en: 'Overview' },
    icon: 'LayoutDashboard',
    color: 'bg-slate-500',
    enabled: true,
    order: 1,
    action: 'dialog',
    actionValue: 'dashboard'
  },
  {
    id: 'property',
    title: { fr: 'Nouvelle propriété', en: 'New Property' },
    description: { fr: 'Ajouter un bien', en: 'Add a property' },
    icon: 'Plus',
    color: 'bg-blue-500',
    enabled: true,
    order: 2,
    action: 'dialog',
    actionValue: 'property'
  },
  {
    id: 'contract',
    title: { fr: 'Nouveau contrat', en: 'New Contract' },
    description: { fr: 'Créer un bail', en: 'Create a lease' },
    icon: 'FileText',
    color: 'bg-yellow-500',
    enabled: true,
    order: 3,
    action: 'dialog',
    actionValue: 'contract'
  },
  {
    id: 'roommate',
    title: { fr: 'Ajouter locataire', en: 'Add Tenant' },
    description: { fr: 'Enregistrer un locataire', en: 'Register a tenant' },
    icon: 'Users',
    color: 'bg-purple-500',
    enabled: true,
    order: 4,
    action: 'dialog',
    actionValue: 'roommate'
  }
];

export const useQuickActionsManager = () => {
  const { userType, user } = useAuth();
  const { toast } = useToast();
  const [quickActions, setQuickActions] = useState<QuickActionConfig[]>(defaultQuickActions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = userType === 'admin';

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
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des actions rapides, utilisation des actions par défaut",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveQuickActions = async (actions: QuickActionConfig[]) => {
    if (!isAdmin) {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent modifier cette configuration",
        variant: "destructive",
      });
      return false;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive",
      });
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
      
      toast({
        title: "Succès",
        description: "Configuration des actions rapides mise à jour",
      });
      return true;
    } catch (error) {
      console.error('Error saving quick actions:', error);
      toast({
        title: "Erreur de permissions",
        description: "Vérifiez les règles Firestore et vos permissions administrateur",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleAction = async (actionId: string) => {
    if (!isAdmin) {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent modifier les actions",
        variant: "destructive",
      });
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
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent supprimer des actions",
        variant: "destructive",
      });
      return false;
    }

    console.log('Removing action:', actionId);
    
    const updatedActions = quickActions.filter(action => action.id !== actionId);
    const reorderedActions = updatedActions.map((action, index) => ({
      ...action,
      order: index + 1
    }));
    
    const success = await saveQuickActions(reorderedActions);
    if (success) {
      toast({
        title: "Succès",
        description: "Action rapide supprimée",
      });
    }
    return success;
  };

  const updateAction = async (updatedAction: QuickActionConfig) => {
    if (!isAdmin) {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent modifier les actions",
        variant: "destructive",
      });
      return false;
    }

    console.log('Updating action:', updatedAction);
    
    const updatedActions = quickActions.map(action =>
      action.id === updatedAction.id ? updatedAction : action
    );
    
    const success = await saveQuickActions(updatedActions);
    if (success) {
      toast({
        title: "Succès",
        description: "Action rapide mise à jour",
      });
    }
    return success;
  };

  const addCustomAction = async (newAction: Omit<QuickActionConfig, 'order'>) => {
    if (!isAdmin) {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent ajouter des actions",
        variant: "destructive",
      });
      return false;
    }

    console.log('Adding custom action:', newAction);
    
    const actionWithOrder = {
      ...newAction,
      order: quickActions.length + 1
    };
    const updatedActions = [...quickActions, actionWithOrder];
    
    const success = await saveQuickActions(updatedActions);
    if (success) {
      toast({
        title: "Succès",
        description: "Action rapide ajoutée avec succès",
      });
    }
    return success;
  };

  const getEnabledActions = () => {
    const enabledActions = quickActions
      .filter(action => action.enabled === true)
      .sort((a, b) => a.order - b.order);
    
    console.log('Getting enabled actions:', enabledActions);
    console.log('All actions:', quickActions);
    console.log('Current refresh key:', refreshKey);
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
    refreshKey
  };
};
