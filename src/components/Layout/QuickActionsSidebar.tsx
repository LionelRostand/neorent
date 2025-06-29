
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { createQuickActionsConfig } from '@/components/OwnerSpace/QuickActions/quickActionsConfig';
import { useAuth } from '@/hooks/useAuth';
import SidebarQuickActionsManager from '@/components/OwnerSpace/QuickActions/SidebarQuickActionsManager';

interface QuickActionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickActionsSidebar: React.FC<QuickActionsSidebarProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { userProfile, userType, user } = useAuth();
  const { getEnabledActions, refreshKey } = useQuickActionsManager();

  // Vérifier si l'utilisateur est admin
  const isAdmin = userType === 'admin' || user?.email === 'admin@neotech-consulting.com';

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActionsTitle: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const {
    openDialog,
    setOpenDialog,
    navigate,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(userProfile);

  // Use only enabled actions
  const enabledActions = getEnabledActions();
  
  const quickActions = userProfile ? createQuickActionsConfig(
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto">
      {/* Overlay pour mobile */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-green-600 to-green-700 shadow-lg lg:static lg:shadow-none">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-500/30">
            <div className="flex items-center min-w-0">
              <Building className="h-6 w-6 text-white mr-2 flex-shrink-0" />
              <h1 className="text-lg font-bold text-white truncate">{getLocalizedText('quickActionsTitle')}</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 lg:hidden flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Bouton de gestion pour les admins */}
          {isAdmin && (
            <div className="p-4">
              <SidebarQuickActionsManager />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <nav className="space-y-2 py-4 px-3" key={refreshKey}>
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Quick action clicked:', action);
                        action.action();
                        onClose();
                      }}
                      className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors text-white/90 hover:text-white hover:bg-green-500/20"
                    >
                      <div className={`p-2 rounded ${action.color} mr-3 flex-shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium truncate">{action.title}</div>
                        <div className="text-xs text-white/70 truncate">{action.description}</div>
                        {action.preview && (
                          <div className="text-xs text-green-200 font-medium mt-1 truncate">{action.preview}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
                {quickActions.length === 0 && (
                  <div className="p-4 text-center text-white/70 text-sm">
                    Aucune action rapide configurée
                  </div>
                )}
              </nav>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-green-500/30 flex-shrink-0">
            <div className="text-center">
              <div className="text-white text-sm font-medium animate-pulse">
                NEOTECH-CONSULTING
              </div>
              <div className="text-green-200 text-xs mt-1">
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
