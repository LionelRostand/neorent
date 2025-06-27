
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import ConfigurableQuickActionItem from './QuickActions/ConfigurableQuickActionItem';
import QuickActionDialogs from './QuickActions/QuickActionDialogs';

interface OwnerQuickActionsProps {
  ownerProfile: any;
  setActiveView?: (view: string) => void;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile, setActiveView }) => {
  const { i18n } = useTranslation();
  const { getEnabledActions, refreshKey } = useQuickActionsManager();
  
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

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActions: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
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

  if (enabledActions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {getLocalizedText('quickActions')}
        </h3>
        <p className="text-gray-500 text-sm">Aucune action rapide configurée</p>
      </div>
    );
  }

  return (
    <>
      <div key={refreshKey} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {getLocalizedText('quickActions')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {enabledActions.map((action) => (
            <ConfigurableQuickActionItem
              key={action.id}
              title={getLocalizedActionText(action, 'title')}
              description={getLocalizedActionText(action, 'description')}
              icon={action.icon}
              color={action.color}
              onClick={() => handleActionClick(action)}
            />
          ))}
        </div>
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
