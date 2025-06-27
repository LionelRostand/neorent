
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import OwnerQuickActions from './OwnerQuickActions';

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
  const currentYear = new Date().getFullYear();

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

  return (
    <div className="w-64 bg-gradient-to-b from-green-600 to-green-700 text-white flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/30 flex-shrink-0">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-white mr-2" />
          <div>
            <h1 className="text-sm font-bold text-white">{getLocalizedText('ownerSpace')}</h1>
            <p className="text-xs text-green-200">{ownerProfile?.name || getLocalizedText('owner')}</p>
          </div>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="text-white hover:text-white/80 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Content - takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full [&>div>div[style]]:!pr-0">
          <div className="p-4">
            <OwnerQuickActions 
              ownerProfile={ownerProfile} 
              setActiveView={setActiveView}
              showControls={true}
            />
          </div>
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
  );
};

export default OwnerSpaceQuickActionsSidebar;
