
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import ConfigurableQuickActionItem from './QuickActions/ConfigurableQuickActionItem';
import QuickActionDialogs from './QuickActions/QuickActionDialogs';
import QuickActionsManager from './QuickActions/QuickActionsManager';

interface OwnerQuickActionsProps {
  ownerProfile: any;
  setActiveView?: (view: string) => void;
  showControls?: boolean;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ 
  ownerProfile, 
  setActiveView,
  showControls = false 
}) => {
  const { i18n } = useTranslation();
  const { getEnabledActions, refreshKey, isAdmin } = useQuickActionsManager();
  
  const {
    openDialog,
    setOpenDialog,
    navigate,
    handlePropertySubmit,
    handleRoommateSubmit,
    handleTenantSubmit,
    handleContractSubmit,
    handleInspectionSubmit,
    handlePaymentSubmit,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(ownerProfile);

  const enabledActions = getEnabledActions();

  console.log('OwnerQuickActions debug:', { 
    showControls, 
    isAdmin, 
    enabledActionsCount: enabledActions.length
  });

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActions: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
      },
      noActionsConfigured: {
        fr: 'Aucune action rapide configurée',
        en: 'No quick actions configured'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const getLocalizedActionText = (action: any, field: 'title' | 'description'): string => {
    const currentLang = i18n.language as 'fr' | 'en';
    const fieldValue = action[field];
    
    if (fieldValue && typeof fieldValue === 'object' && 'fr' in fieldValue && 'en' in fieldValue) {
      return fieldValue[currentLang] || fieldValue['fr'] || '';
    }
    
    if (typeof fieldValue === 'string') {
      return fieldValue;
    }
    
    return '';
  };

  const handleActionClick = (action: any) => {
    console.log('Quick action clicked:', action);
    
    if (action.action === 'navigate' && action.actionValue) {
      if (setActiveView) {
        setActiveView(action.actionValue);
      } else {
        navigate(action.actionValue);
      }
    } else if (action.action === 'dialog' && action.actionValue) {
      setOpenDialog(action.actionValue);
    }
  };

  return (
    <>
      <div key={refreshKey} className="bg-green-600 rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base md:text-lg font-semibold text-white">
            {getLocalizedText('quickActions')}
          </h3>
          {/* Show QuickActionsManager button for admins when controls are enabled */}
          {showControls && isAdmin && (
            <div className="w-full sm:w-auto">
              <QuickActionsManager />
            </div>
          )}
        </div>
        
        {enabledActions.length === 0 ? (
          <p className="text-white/70 text-sm">{getLocalizedText('noActionsConfigured')}</p>
        ) : (
          /* Vertical stack of actions */
          <div className="space-y-2 md:space-y-3">
            {enabledActions.map((action) => (
              <ConfigurableQuickActionItem
                key={action.id}
                title={getLocalizedActionText(action, 'title')}
                description={getLocalizedActionText(action, 'description')}
                icon={action.icon}
                color={action.color}
                onClick={() => handleActionClick(action)}
                actionId={action.id}
                showControls={showControls}
              />
            ))}
          </div>
        )}
      </div>

      <QuickActionDialogs
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onPropertySubmit={handlePropertySubmit}
        onRoommateSubmit={handleRoommateSubmit}
        onTenantSubmit={handleTenantSubmit}
        onContractSubmit={handleContractSubmit}
        onInspectionSubmit={handleInspectionSubmit}
        onPaymentSubmit={handlePaymentSubmit}
        ownerProperties={ownerProperties}
        activeTenants={activeTenants}
        expiringContracts={expiringContracts}
        pendingPayments={pendingPayments}
      />
    </>
  );
};

export default OwnerQuickActions;
