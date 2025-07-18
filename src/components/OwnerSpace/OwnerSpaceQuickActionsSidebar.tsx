
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import OwnerQuickActions from './OwnerQuickActions';
import SidebarQuickActionsManager from './QuickActions/SidebarQuickActionsManager';
import { useAuth } from '@/hooks/useAuth';

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
  const { i18n } = useTranslation();
  const { userType, user } = useAuth();
  const currentYear = new Date().getFullYear();

  // Vérifier si l'utilisateur est admin
  const isAdmin = userType === 'admin' || user?.email === 'admin@neotech-consulting.com';

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      ownerSpace: {
        fr: 'Espace Propriétaire',
        en: 'Owner Space'
      },
      owner: {
        fr: 'Propriétaire',
        en: 'Owner'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Corriger l'affichage du nom du propriétaire
  const getOwnerDisplayName = () => {
    if (ownerProfile?.name) {
      return ownerProfile.name;
    }
    if (ownerProfile?.email) {
      return ownerProfile.email;
    }
    return getLocalizedText('owner');
  };

  return (
    <div className="w-full md:w-64 bg-gradient-to-b from-green-600 to-green-700 text-white flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b border-green-500/30 flex-shrink-0">
        <div className="flex items-center min-w-0">
          <Building className="h-5 w-5 md:h-6 md:w-6 text-white mr-2 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm font-bold text-white truncate">{getLocalizedText('ownerSpace')}</h1>
            <p className="text-xs text-green-200 truncate">{getOwnerDisplayName()}</p>
          </div>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="text-white hover:text-white/80 md:hidden flex-shrink-0 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Admin Management Button */}
      {isAdmin && (
        <div className="p-3 md:p-4 border-b border-green-500/30 flex-shrink-0">
          <SidebarQuickActionsManager />
        </div>
      )}
      
      {/* Content - takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full [&>div>div[style]]:!pr-0">
          <div className="p-3 md:p-4">
            <OwnerQuickActions 
              ownerProfile={ownerProfile} 
              setActiveView={setActiveView}
              showControls={isAdmin}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-green-500/30 flex-shrink-0">
        <div className="text-center">
          <div className="text-white text-xs md:text-sm font-medium animate-pulse">
            NEOTECH-CONSULTING
          </div>
          <div className="text-green-200 text-xs mt-1">
            Version 1.0 • {currentYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceQuickActionsSidebar;
