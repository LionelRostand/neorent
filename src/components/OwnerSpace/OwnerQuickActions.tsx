
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
  const { getEnabledActions, isAdmin } = useQuickActionsManager();
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
    expiringContracts.length, // Fix: pass length instead of array
    pendingPayments.length, // Fix: pass length instead of array
    () => '', // dummy t function since we're using getLocalizedText
    enabledActions,
    setActiveView // Pass setActiveView to enable view switching
  );

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {getLocalizedText('quickActionsTitle')}
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowMenuSelector(true)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title={getLocalizedText('addMenu')}
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-4 pt-0">
          {quickActions.map((action) => (
            <QuickActionItem key={action.id} action={action} />
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
