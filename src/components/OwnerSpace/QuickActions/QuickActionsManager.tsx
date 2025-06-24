
import React, { useState } from 'react';
import { useQuickActionsManager, QuickActionConfig } from '@/hooks/useQuickActionsManager';
import { useAuth } from '@/hooks/useAuth';
import FirestoreRulesHelper from './FirestoreRulesHelper';
import PermissionDeniedView from './PermissionDeniedView';
import QuickActionConfigModal from './QuickActionConfigModal';

const QuickActionsManager: React.FC = () => {
  const { userType } = useAuth();
  const { quickActions, isAdmin, updateAction } = useQuickActionsManager();
  const [showPermissionsError, setShowPermissionsError] = useState(false);
  const [configAction, setConfigAction] = useState<QuickActionConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

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

  if (!isAdmin) {
    return <PermissionDeniedView />;
  }

  return (
    <div className="space-y-6">
      {showPermissionsError && <FirestoreRulesHelper />}

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
