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
  },
  {
    id: 'inspection',
    title: { fr: 'État des lieux', en: 'Property Inspection' },
    description: { fr: 'Programmer une visite', en: 'Schedule a visit' },
    icon: 'Home',
    color: 'bg-orange-500',
    enabled: true,
    order: 5,
    action: 'dialog',
    actionValue: 'inspection'
  },
  {
    id: 'forecasting',
    title: { fr: 'Prévisions financières', en: 'Financial Forecasting' },
    description: { fr: 'Projections de revenus', en: 'Revenue projections' },
    icon: 'TrendingUp',
    color: 'bg-emerald-500',
    enabled: true,
    order: 6,
    action: 'navigate',
    actionValue: '/admin/forecasting'
  },
  {
    id: 'maintenance',
    title: { fr: 'Maintenance', en: 'Maintenance' },
    description: { fr: 'Demande d\'intervention', en: 'Service request' },
    icon: 'Wrench',
    color: 'bg-red-500',
    enabled: true,
    order: 7,
    action: 'navigate',
    actionValue: '/admin/maintenance'
  },
  {
    id: 'messages',
    title: { fr: 'Messages', en: 'Messages' },
    description: { fr: 'Discuter avec les locataires', en: 'Chat with tenants' },
    icon: 'MessageSquare',
    color: 'bg-indigo-500',
    enabled: true,
    order: 8,
    action: 'navigate',
    actionValue: '/admin/messages'
  },
  {
    id: 'taxes',
    title: { fr: 'Gestion fiscale', en: 'Tax Management' },
    description: { fr: 'Déclarations fiscales', en: 'Tax declarations' },
    icon: 'FileText',
    color: 'bg-cyan-500',
    enabled: true,
    order: 9,
    action: 'navigate',
    actionValue: '/admin/taxes'
  },
  {
    id: 'charges',
    title: { fr: 'Calculer charges', en: 'Calculate Charges' },
    description: { fr: 'Révision annuelle', en: 'Annual review' },
    icon: 'Calculator',
    color: 'bg-teal-500',
    enabled: true,
    order: 10,
    action: 'navigate',
    actionValue: '/admin/rental-charges'
  }
];

export const useQuickActionsManager = () => {
  const { userType } = useAuth();
  const { toast } = useToast();
  const [quickActions, setQuickActions] = useState<QuickActionConfig[]>(defaultQuickActions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = userType === 'admin';

  useEffect(() => {
    loadQuickActions();
  }, [refreshKey]);

  const loadQuickActions = async () => {
    try {
      const configDoc = await getDoc(doc(db, 'system_config', 'quick_actions'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setQuickActions(data.actions || defaultQuickActions);
      } else {
        setQuickActions(defaultQuickActions);
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
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent modifier cette configuration",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'system_config', 'quick_actions'), {
        actions: actions,
        updatedAt: new Date().toISOString()
      });

      setQuickActions(actions);
      setRefreshKey(prev => prev + 1); // Force refresh
      toast({
        title: "Succès",
        description: "Configuration des actions rapides mise à jour",
      });
    } catch (error) {
      console.error('Error saving quick actions:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const removeAction = async (actionId: string) => {
    if (!isAdmin) {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent supprimer des actions",
        variant: "destructive",
      });
      return;
    }

    console.log('Removing action:', actionId);
    const updatedActions = quickActions.filter(action => action.id !== actionId);
    console.log('Updated actions after removal:', updatedActions);
    
    // Réorganiser les numéros d'ordre
    const reorderedActions = updatedActions.map((action, index) => ({
      ...action,
      order: index + 1
    }));
    
    try {
      await saveQuickActions(reorderedActions);
      toast({
        title: "Succès",
        description: "Action rapide supprimée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const getEnabledActions = () => {
    const enabledActions = quickActions
      .filter(action => action.enabled)
      .sort((a, b) => a.order - b.order);
    
    console.log('Enabled actions:', enabledActions);
    return enabledActions;
  };

  return {
    quickActions,
    loading,
    saving,
    isAdmin,
    toggleAction: async (actionId: string) => {
      const updatedActions = quickActions.map(action =>
        action.id === actionId ? { ...action, enabled: !action.enabled } : action
      );
      await saveQuickActions(updatedActions);
    },
    reorderActions: async (dragIndex: number, hoverIndex: number) => {
      const dragAction = quickActions[dragIndex];
      const updatedActions = [...quickActions];
      updatedActions.splice(dragIndex, 1);
      updatedActions.splice(hoverIndex, 0, dragAction);
      
      // Update order numbers
      const reorderedActions = updatedActions.map((action, index) => ({
        ...action,
        order: index + 1
      }));
      
      await saveQuickActions(reorderedActions);
    },
    addCustomAction: async (newAction: Omit<QuickActionConfig, 'order'>) => {
      const actionWithOrder = {
        ...newAction,
        order: quickActions.length + 1
      };
      const updatedActions = [...quickActions, actionWithOrder];
      await saveQuickActions(updatedActions);
    },
    removeAction,
    getEnabledActions,
    refreshKey
  };
};
