
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { createQuickActionsConfig } from '@/components/OwnerSpace/QuickActions/quickActionsConfig';
import { useAuth } from '@/hooks/useAuth';

interface QuickActionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickActionsSidebar: React.FC<QuickActionsSidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { userProfile } = useAuth();

  const {
    openDialog,
    setOpenDialog,
    navigate,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(userProfile);

  const quickActions = userProfile ? createQuickActionsConfig(
    navigate,
    setOpenDialog,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  ) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto">
      {/* Overlay pour mobile */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-blue-600 shadow-lg lg:static lg:shadow-none">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center">
              <Building className="h-6 w-6 text-white mr-2" />
              <h1 className="text-xl font-bold text-white">Actions Rapides</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <nav className="space-y-2 py-4 px-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        action.action();
                        onClose();
                      }}
                      className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors text-white/90 hover:text-white hover:bg-blue-500"
                    >
                      <div className={`p-2 rounded ${action.color} mr-3 flex-shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium truncate">{action.title}</div>
                        <div className="text-xs text-white/60 truncate">{action.description}</div>
                        <div className="text-xs text-blue-200 font-medium mt-1">{action.preview}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500 flex-shrink-0">
            <div className="text-center">
              <div className="text-white text-sm font-medium animate-pulse">
                NEOTECH-CONSULTING
              </div>
              <div className="text-white/80 text-xs mt-1">
                Version 1.0 • {currentYear}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSidebar;
