
import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { createQuickActionsConfig } from '@/components/OwnerSpace/QuickActions/quickActionsConfig';

interface SidebarQuickActionsProps {
  onMobileClose?: () => void;
}

const SidebarQuickActions: React.FC<SidebarQuickActionsProps> = ({ onMobileClose }) => {
  const { userProfile } = useAuth();
  const { i18n } = useTranslation();

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
    pendingPayments,
    () => '' // dummy t function since we're using getLocalizedText
  ) : [];

  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="px-3 py-4 border-t border-green-400/30">
      <div className="flex items-center px-3 py-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
        <Plus className="mr-2 h-4 w-4" />
        {getLocalizedText('quickActionsTitle')}
      </div>
      <div className="space-y-1">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                action.action();
                if (onMobileClose) onMobileClose();
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-green-400/50 rounded-md transition-colors text-left"
            >
              <div className={`p-1.5 rounded ${action.color} mr-3 flex-shrink-0`}>
                <Icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{action.title}</div>
                <div className="text-xs text-white/60 truncate">{action.preview}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarQuickActions;
