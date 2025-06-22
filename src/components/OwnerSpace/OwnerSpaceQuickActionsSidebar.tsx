
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { createQuickActionsConfig } from './QuickActions/quickActionsConfig';
import QuickActionDialogs from './QuickActions/QuickActionDialogs';

interface OwnerSpaceQuickActionsSidebarProps {
  ownerProfile: any;
}

const OwnerSpaceQuickActionsSidebar: React.FC<OwnerSpaceQuickActionsSidebarProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();

  const {
    openDialog,
    setOpenDialog,
    properties,
    navigate,
    handlePropertySubmit,
    handleRoommateSubmit,
    handleInspectionSubmit,
    handleContractSubmit,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(ownerProfile);

  const quickActions = createQuickActionsConfig(
    navigate,
    setOpenDialog,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    t
  );

  return (
    <>
      <div className="bg-green-500 w-80 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 flex-shrink-0 border-b border-green-400/30">
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">{t('quickActions.title')}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      action.action();
                    }}
                    className="w-full flex items-center p-4 text-white/90 hover:text-white hover:bg-green-400/50 rounded-lg transition-colors text-left group"
                  >
                    <div className={`p-3 rounded-lg ${action.color} mr-4 flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base truncate">{action.title}</div>
                      <div className="text-sm text-white/70 truncate mt-1">{action.description}</div>
                      <div className="text-sm text-green-200 font-medium mt-2">{action.preview}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-green-400/30 flex-shrink-0">
          <div className="text-center">
            <div className="text-white text-sm font-medium animate-pulse">
              NEOTECH-CONSULTING
            </div>
            <div className="text-white/80 text-xs mt-1">
              Version 1.0 • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <QuickActionDialogs
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        properties={properties}
        onPropertySubmit={handlePropertySubmit}
        onRoommateSubmit={handleRoommateSubmit}
        onInspectionSubmit={handleInspectionSubmit}
        onContractSubmit={handleContractSubmit}
      />
    </>
  );
};

export default OwnerSpaceQuickActionsSidebar;
