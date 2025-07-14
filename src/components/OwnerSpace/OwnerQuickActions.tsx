
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import ConfigurableQuickActionItem from './QuickActions/ConfigurableQuickActionItem';
import QuickActionDialogs from './QuickActions/QuickActionDialogs';

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
  const { t, i18n } = useTranslation();
  const { getEnabledActions, refreshKey, isAdmin, reorderActions } = useQuickActionsManager();
  
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
    enabledActionsCount: enabledActions.length,
    currentLanguage: i18n.language,
    ownerProfile: ownerProfile
  });

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
    console.log('setActiveView function available:', !!setActiveView);
    
    if (action.action === 'navigate' && action.actionValue) {
      // Check if it's an admin path and we have setActiveView
      if (action.actionValue.startsWith('/admin/') && setActiveView) {
        // Convert admin path to activeView format
        const viewName = action.actionValue.replace('/admin/', 'admin-');
        console.log('Setting active view to:', viewName);
        setActiveView(viewName);
      } else if (setActiveView) {
        // For non-admin paths within owner space
        setActiveView(action.actionValue);
      } else {
        // Fallback to navigation
        navigate(action.actionValue);
      }
    } else if (action.action === 'dialog' && action.actionValue) {
      setOpenDialog(action.actionValue);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !isAdmin) {
      return;
    }

    const { source, destination } = result;
    
    if (source.index === destination.index) {
      return;
    }

    console.log('Reordering actions:', { source: source.index, destination: destination.index });
    
    try {
      await reorderActions(source.index, destination.index);
    } catch (error) {
      console.error('Error reordering actions:', error);
    }
  };

  return (
    <>
      <div key={refreshKey} className="bg-green-600 rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base md:text-lg font-semibold text-white">
            {t('navigation.quickActions', 'Actions rapides')}
          </h3>
        </div>
        
        {enabledActions.length === 0 ? (
          <p className="text-white/70 text-sm">
            {i18n.language === 'en' ? 'No quick actions configured' : 'Aucune action rapide configurée'}
          </p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="quick-actions">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 md:space-y-3"
                >
                  {enabledActions.map((action, index) => (
                    <Draggable 
                      key={action.id} 
                      draggableId={action.id} 
                      index={index}
                      isDragDisabled={!isAdmin && !showControls}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            snapshot.isDragging ? 'opacity-75 transform rotate-2' : ''
                          }`}
                        >
                          <ConfigurableQuickActionItem
                            title={getLocalizedActionText(action, 'title')}
                            description={getLocalizedActionText(action, 'description')}
                            icon={action.icon}
                            color={action.color}
                            onClick={() => handleActionClick(action)}
                            actionId={action.id}
                            showControls={showControls}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
