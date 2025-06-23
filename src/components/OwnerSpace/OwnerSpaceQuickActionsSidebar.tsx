
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { createQuickActionsConfig } from './QuickActions/quickActionsConfig';
import QuickActionsManager from './QuickActions/QuickActionsManager';

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
  const { isAdmin, removeAction, getEnabledActions, refreshKey, loading } = useQuickActionsManager();
  const [showQuickActionsManager, setShowQuickActionsManager] = useState(false);

  const {
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(ownerProfile);

  // Use ONLY enabled actions
  const enabledActions = getEnabledActions();
  console.log('OwnerSpaceQuickActionsSidebar - Enabled actions:', enabledActions);
  console.log('OwnerSpaceQuickActionsSidebar - Loading:', loading);
  
  const quickActionsConfig = createQuickActionsConfig(
    (path: string) => {
      // Convertir les routes admin en vues pour l'espace propriétaire
      const adminToOwnerView: Record<string, string> = {
        '/admin/dashboard': 'admin-dashboard',
        '/admin/properties': 'admin-properties',
        '/admin/tenants': 'admin-tenants',
        '/admin/roommates': 'admin-roommates',
        '/admin/contracts': 'admin-contracts',
        '/admin/inspections': 'admin-inspections',
        '/admin/rent-management': 'admin-rent-management',
        '/admin/rental-charges': 'admin-rental-charges',
        '/admin/forecasting': 'admin-forecasting',
        '/admin/maintenance': 'admin-maintenance',
        '/admin/messages': 'admin-messages',
        '/admin/taxes': 'admin-taxes',
        '/admin/website': 'admin-website',
        '/admin/settings': 'admin-settings',
        '/admin/help': 'admin-help'
      };
      
      const ownerView = adminToOwnerView[path];
      if (ownerView) {
        setActiveView(ownerView);
      } else {
        console.log('Navigation not handled for path:', path);
      }
    },
    setActiveView, // use setActiveView for dialog actions
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    t,
    enabledActions // Pass only enabled actions
  );

  console.log('OwnerSpaceQuickActionsSidebar - Quick actions config:', quickActionsConfig);

  const handleActionClick = (action: any) => {
    action.action();
    // Close mobile sidebar after selection
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent, actionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('OwnerSpace - Deleting action:', actionId);
    await removeAction(actionId);
  };

  if (loading) {
    return (
      <div className="bg-green-500 w-64 sm:w-72 md:w-80 lg:w-96 h-full flex flex-col">
        <div className="p-4 lg:p-6 flex-shrink-0 border-b border-green-400/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-bold text-white">{t('ownerSpace.quickActions.title')}</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/70 text-sm">Chargement des actions...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-green-500 w-64 sm:w-72 md:w-80 lg:w-96 h-full flex flex-col" key={`owner-sidebar-${refreshKey}`}>
        {/* Header */}
        <div className="p-4 lg:p-6 flex-shrink-0 border-b border-green-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg lg:text-xl font-bold text-white">{t('ownerSpace.quickActions.title')}</h2>
            </div>
            
            {/* Bouton de gestion pour les admins seulement */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowQuickActionsManager(true)}
                  className="text-white hover:bg-green-400/30 p-2"
                  title="Gérer les actions"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content with hidden scrollbar */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">
              {quickActionsConfig.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/70 text-sm">Aucune action rapide activée</p>
                  {isAdmin && (
                    <p className="text-white/50 text-xs mt-2">
                      Cliquez sur l'icône paramètres pour configurer les actions rapides
                    </p>
                  )}
                </div>
              ) : (
                quickActionsConfig.map((action) => {
                  const Icon = action.icon;
                  const isActive = activeView === action.id || 
                    (action.id.startsWith('admin-') && activeView === action.id);
                  
                  return (
                    <div key={`${action.id}-${refreshKey}`} className="relative group">
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

                      {/* Bouton rouge de suppression pour les admins */}
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
                })
              )}
            </div>
          </div>
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

      {/* Modal pour le gestionnaire des actions rapides */}
      <Dialog open={showQuickActionsManager} onOpenChange={setShowQuickActionsManager}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">
              Gestionnaire des Actions Rapides
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            <QuickActionsManager />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OwnerSpaceQuickActionsSidebar;
