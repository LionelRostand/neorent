
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { createQuickActionsConfig } from './QuickActions/quickActionsConfig';

interface OwnerSpaceQuickActionsSidebarProps {
  ownerProfile: any;
  activeView: string;
  setActiveView: (view: string) => void;
  onMobileClose?: () => void;
}

const OwnerSpaceQuickActionsSidebar: React.FC<OwnerSpaceQuickActionsSidebarProps> = ({ 
  ownerProfile, 
  activeView, 
  setActiveView,
  onMobileClose
}) => {
  const { t } = useTranslation();
  const { isAdmin, removeAction, getEnabledActions, refreshKey } = useQuickActionsManager();

  const {
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(ownerProfile);

  // Force re-calculation of enabled actions when refreshKey changes
  const enabledActions = getEnabledActions();
  const quickActionsConfig = createQuickActionsConfig(
    () => {}, // navigate function not needed here
    setActiveView, // use setActiveView instead of setOpenDialog
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    t,
    enabledActions
  );

  const handleActionClick = (action: any) => {
    action.action();
    // Close mobile sidebar after selection
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleDelete = (e: React.MouseEvent, actionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeAction(actionId);
  };

  return (
    <div className="bg-green-500 w-64 sm:w-72 md:w-80 lg:w-96 h-full flex flex-col" key={refreshKey}>
      {/* Header */}
      <div className="p-4 lg:p-6 flex-shrink-0 border-b border-green-400/30">
        <div className="flex items-center">
          <Plus className="h-5 w-5 lg:h-6 lg:w-6 text-white mr-2" />
          <h2 className="text-lg lg:text-xl font-bold text-white">{t('ownerSpace.quickActions.title')}</h2>
        </div>
      </div>

      {/* Content with ScrollArea */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">
            {quickActionsConfig.map((action) => {
              const Icon = action.icon;
              const isActive = activeView === action.id;
              
              return (
                <div key={action.id} className="relative group">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleActionClick(action);
                    }}
                    className={`w-full flex items-center p-3 lg:p-4 rounded-lg transition-colors text-left ${
                      isActive 
                        ? 'bg-green-400/70 text-white' 
                        : 'text-white/90 hover:text-white hover:bg-green-400/50'
                    }`}
                  >
                    <div className={`p-2 lg:p-3 rounded-lg ${action.color} mr-3 lg:mr-4 flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm lg:text-base truncate">{action.title}</div>
                      <div className="text-xs lg:text-sm text-white/70 truncate mt-1">{action.description}</div>
                      <div className="text-xs lg:text-sm text-green-200 font-medium mt-1 lg:mt-2">{action.preview}</div>
                    </div>
                  </button>

                  {/* Petit bouton rouge de suppression pour les admins */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(e, action.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 shadow-lg border border-white/20"
                      title="Supprimer cette action"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-green-400/30 flex-shrink-0">
        <div className="text-center">
          <div className="text-white text-xs lg:text-sm font-medium animate-pulse">
            NEOTECH-CONSULTING
          </div>
          <div className="text-white/80 text-xs mt-1">
            Version 1.0 • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceQuickActionsSidebar;
