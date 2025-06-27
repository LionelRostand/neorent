
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { createQuickActionsConfig } from './QuickActions/quickActionsConfig';
import QuickActionItem from './QuickActions/QuickActionItem';
import QuickActionDialogs from './QuickActions/QuickActionDialogs';
import QuickActionsManager from './QuickActions/QuickActionsManager';
import SidebarMenuSelector from './QuickActions/SidebarMenuSelector';

interface OwnerQuickActionsProps {
  ownerProfile: any;
  setActiveView?: (view: string) => void;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile, setActiveView }) => {
  const { i18n } = useTranslation();
  const { getEnabledActions, isAdmin, refreshKey } = useQuickActionsManager();
  const [showMenuSelector, setShowMenuSelector] = useState(false);
  
  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActionsTitle: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
      },
      addMenu: {
        fr: 'Ajouter un menu',
        en: 'Add Menu'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };
  
  const {
    openDialog,
    setOpenDialog,
    properties,
    navigate,
    handlePropertySubmit,
    handleRoommateSubmit,
    handleInspectionSubmit,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(ownerProfile);

  const enabledActions = getEnabledActions();
  const quickActions = createQuickActionsConfig(
    navigate,
    setOpenDialog,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    () => '',
    enabledActions,
    setActiveView,
    i18n.language // Pass current language
  );

  return (
    <>
      <Card className="h-fit w-full bg-gradient-to-b from-green-600 to-green-700 border-green-500/30 shadow-lg" key={`quick-actions-${refreshKey}`}>
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="flex items-center justify-between text-base sm:text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-white truncate">{getLocalizedText('quickActionsTitle')}</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowMenuSelector(true)}
                className="p-1.5 sm:p-2 hover:bg-green-500/30 rounded-full transition-colors flex-shrink-0"
                title={getLocalizedText('addMenu')}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" />
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 pt-0">
          {quickActions.map((action) => (
            <QuickActionItem key={`${action.id}-${refreshKey}`} action={action} />
          ))}
        </CardContent>
      </Card>

      {isAdmin && (
        <QuickActionsManager />
      )}

      {showMenuSelector && (
        <SidebarMenuSelector
          onClose={() => setShowMenuSelector(false)}
          onMenuSelect={(menuItem) => {
            console.log('Menu sélectionné:', menuItem);
            setShowMenuSelector(false);
          }}
        />
      )}

      <QuickActionDialogs
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        properties={properties}
        onPropertySubmit={handlePropertySubmit}
        onRoommateSubmit={handleRoommateSubmit}
        onInspectionSubmit={handleInspectionSubmit}
      />
    </>
  );
};

export default OwnerQuickActions;
