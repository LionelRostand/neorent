
import React, { useState } from 'react';
import { useQuickActionsManager, QuickActionConfig } from '@/hooks/useQuickActionsManager';
import { useAuth } from '@/hooks/useAuth';
import FirestoreRulesHelper from './FirestoreRulesHelper';
import PermissionDeniedView from './PermissionDeniedView';
import CurrentActionsSection from './CurrentActionsSection';
import AvailableMenusSection from './AvailableMenusSection';
import QuickActionConfigModal from './QuickActionConfigModal';

const QuickActionsManager: React.FC = () => {
  const { userType } = useAuth();
  const { quickActions, isAdmin, toggleAction, removeAction, updateAction, saving, addCustomAction } = useQuickActionsManager();
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  const [showPermissionsError, setShowPermissionsError] = useState(false);
  const [addingMenus, setAddingMenus] = useState<Record<string, boolean>>({});
  const [configAction, setConfigAction] = useState<QuickActionConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleToggleAction = async (actionId: string) => {
    setToggleStates(prev => ({ ...prev, [actionId]: true }));
    
    try {
      const success = await toggleAction(actionId);
      if (!success) {
        setShowPermissionsError(true);
      }
    } finally {
      setToggleStates(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const handleConfigureAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      setConfigAction(action);
      setShowConfigModal(true);
    }
  };

  const handleSaveConfig = async (updatedAction: QuickActionConfig) => {
    const success = await updateAction(updatedAction);
    if (!success) {
      setShowPermissionsError(true);
    }
    return success;
  };

  const handleAddMenuToQuickActions = async (menuItem: any) => {
    setAddingMenus(prev => ({ ...prev, [menuItem.path]: true }));
    
    try {
      const newAction = {
        id: menuItem.path.replace('/admin/', ''),
        title: { 
          fr: menuItem.label, 
          en: menuItem.label 
        },
        description: { 
          fr: `Accès rapide à ${menuItem.label}`, 
          en: `Quick access to ${menuItem.label}` 
        },
        icon: menuItem.icon.name || 'Settings',
        color: getColorForMenu(menuItem.path),
        enabled: true,
        action: 'navigate' as const,
        actionValue: menuItem.path
      };

      const success = await addCustomAction(newAction);
      if (!success) {
        setShowPermissionsError(true);
      }
    } finally {
      setAddingMenus(prev => ({ ...prev, [menuItem.path]: false }));
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

  if (!isAdmin) {
    return <PermissionDeniedView />;
  }

  return (
    <div className="space-y-6">
      {showPermissionsError && <FirestoreRulesHelper />}

      <CurrentActionsSection
        quickActions={quickActions}
        onToggleAction={handleToggleAction}
        onRemoveAction={removeAction}
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

      <QuickActionConfigModal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setConfigAction(null);
        }}
        action={configAction}
        onSave={handleSaveConfig}
      />
    </div>
  );
};

export default QuickActionsManager;
