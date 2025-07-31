
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, X, Wrench, TrendingUp, Globe, Settings, HelpCircle } from 'lucide-react';
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
            <p className="text-xs text-green-200">{ownerProfile?.email || 'test@yahoo.com'}</p>
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
      
      {/* Menu Items */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full [&>div>div[style]]:!pr-0">
          <div className="p-0">
            
            {/* Interventions */}
            <div 
              onClick={() => setActiveView('maintenance')}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                activeView === 'maintenance' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">Interventions</div>
                <div className="text-green-200 text-sm">Demandes ouvertes</div>
              </div>
            </div>

            {/* Prévisions */}
            <div 
              onClick={() => setActiveView('forecasting')}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                activeView === 'forecasting' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">Prévisions</div>
                <div className="text-green-200 text-sm">Analyse financière</div>
                <div className="text-green-200 text-sm">Projections revenus</div>
              </div>
            </div>

            {/* Site web */}
            <div 
              onClick={() => setActiveView('website')}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                activeView === 'website' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">Site web</div>
                <div className="text-green-200 text-sm">Gestion site</div>
                <div className="text-green-200 text-sm">Configuration</div>
              </div>
            </div>

            {/* Paramètres */}
            <div 
              onClick={() => setActiveView('admin-settings')}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                activeView === 'admin-settings' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">Paramètres</div>
                <div className="text-green-200 text-sm">Configuration</div>
                <div className="text-green-200 text-sm">Système</div>
              </div>
            </div>

            {/* Aide */}
            <div 
              onClick={() => setActiveView('help')}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                activeView === 'help' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">Aide</div>
                <div className="text-green-200 text-sm">Support</div>
                <div className="text-green-200 text-sm">Documentation</div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-green-500/30 flex-shrink-0">
        <div className="text-center">
          <div className="text-white text-sm font-medium">
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
