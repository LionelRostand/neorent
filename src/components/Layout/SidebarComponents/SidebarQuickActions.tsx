
import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { createQuickActionsConfig } from '@/components/OwnerSpace/QuickActions/quickActionsConfig';

interface SidebarQuickActionsProps {
  onMobileClose?: () => void;
}

const SidebarQuickActions: React.FC<SidebarQuickActionsProps> = ({ onMobileClose }) => {
  const { userProfile } = useAuth();
  const { i18n } = useTranslation();
  const { isAdmin, removeAction, getEnabledActions, refreshKey, reorderActions } = useQuickActionsManager();

  console.log('SidebarQuickActions render, refreshKey:', refreshKey);

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActionsTitle: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete'
      },
      manage: {
        fr: 'Gérer',
        en: 'Manage'
      },
      configure: {
        fr: 'Configurer',
        en: 'Configure'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const {
    setOpenDialog,
    navigate,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(userProfile);

  // Use only enabled actions
  const enabledActions = getEnabledActions();
  console.log('SidebarQuickActions enabledActions:', enabledActions);
  
  const quickActionsConfig = userProfile ? createQuickActionsConfig(
    navigate,
    setOpenDialog,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    () => '',
    enabledActions,
    undefined,
    i18n.language
  ) : [];

  console.log('SidebarQuickActions quickActionsConfig:', quickActionsConfig);

  const handleDelete = async (e: React.MouseEvent, actionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('handleDelete called for actionId:', actionId);
    await removeAction(actionId);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !isAdmin) {
      return;
    }

    const { source, destination } = result;
    
    if (source.index === destination.index) {
      return;
    }

    console.log('Reordering sidebar actions:', { source: source.index, destination: destination.index });
    
    try {
      await reorderActions(source.index, destination.index);
    } catch (error) {
      console.error('Error reordering sidebar actions:', error);
    }
  };

  if (quickActionsConfig.length === 0) {
    console.log('No quick actions to display');
    return null;
  }

  return (
    <div className="px-3 py-4 border-t border-green-400/30" key={`sidebar-quick-actions-${refreshKey}`}>
      <div className="flex items-center px-3 py-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
        <Plus className="mr-2 h-4 w-4" />
        {getLocalizedText('quickActionsTitle')}
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sidebar-quick-actions">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-1"
            >
              {quickActionsConfig.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Draggable 
                    key={`${action.id}-${refreshKey}`} 
                    draggableId={`${action.id}-${refreshKey}`} 
                    index={index}
                    isDragDisabled={!isAdmin}
                  >
                    {(provided, snapshot) => (
                      <div 
                        key={`${action.id}-${refreshKey}`} 
                        className={`relative group ${
                          snapshot.isDragging ? 'opacity-75 transform rotate-1' : ''
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            action.action();
                            if (onMobileClose) onMobileClose();
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-green-400/50 rounded-md transition-colors text-left"
                        >
                          {/* Drag Handle */}
                          {isAdmin && (
                            <div 
                              {...provided.dragHandleProps}
                              className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 cursor-grab"
                            >
                              <GripVertical className="h-3 w-3 text-white/60" />
                            </div>
                          )}
                          
                          <div className={`p-1.5 rounded ${action.color} mr-3 flex-shrink-0`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{action.title}</div>
                            <div className="text-xs text-white/60 truncate">{action.preview}</div>
                          </div>
                        </button>
                        
                        {/* Delete button for admins */}
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(e, action.id)}
                            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 shadow-lg border border-white/10"
                            title={getLocalizedText('delete')}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SidebarQuickActions;
