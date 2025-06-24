
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
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Get header color based on active view
  const getHeaderColor = () => {
    const viewColors: Record<string, string> = {
      'dashboard': 'from-green-600 to-green-700',
      'admin-dashboard': 'from-green-600 to-green-700',
      'property': 'from-blue-600 to-blue-700',
      'admin-properties': 'from-blue-600 to-blue-700',
      'contract': 'from-purple-600 to-purple-700',
      'admin-contracts': 'from-purple-600 to-purple-700',
      'roommate': 'from-orange-600 to-orange-700',
      'admin-roommates': 'from-orange-600 to-orange-700',
      'inspection': 'from-indigo-600 to-indigo-700',
      'admin-inspections': 'from-indigo-600 to-indigo-700',
      'charges': 'from-teal-600 to-teal-700',
      'admin-rental-charges': 'from-teal-600 to-teal-700',
      'maintenance': 'from-red-600 to-red-700',
      'admin-maintenance': 'from-red-600 to-red-700',
      'admin-taxes': 'from-emerald-600 to-emerald-700',
      'admin-forecasting': 'from-yellow-600 to-yellow-700',
      'admin-rent-management': 'from-cyan-600 to-cyan-700',
      'admin-tenants': 'from-pink-600 to-pink-700'
    };
    
    return viewColors[activeView] || 'from-green-600 to-green-700';
  };

  // Get border color for active view gradient
  const getBorderColor = () => {
    const borderColors: Record<string, string> = {
      'dashboard': 'border-green-500/30',
      'admin-dashboard': 'border-green-500/30',
      'property': 'border-blue-500/30',
      'admin-properties': 'border-blue-500/30',
      'contract': 'border-purple-500/30',
      'admin-contracts': 'border-purple-500/30',
      'roommate': 'border-orange-500/30',
      'admin-roommates': 'border-orange-500/30',
      'inspection': 'border-indigo-500/30',
      'admin-inspections': 'border-indigo-500/30',
      'charges': 'border-teal-500/30',
      'admin-rental-charges': 'border-teal-500/30',
      'maintenance': 'border-red-500/30',
      'admin-maintenance': 'border-red-500/30',
      'admin-taxes': 'border-emerald-500/30',
      'admin-forecasting': 'border-yellow-500/30',
      'admin-rent-management': 'border-cyan-500/30',
      'admin-tenants': 'border-pink-500/30'
    };
    
    return borderColors[activeView] || 'border-green-500/30';
  };

  return (
    <div className={`w-64 bg-gradient-to-b ${getHeaderColor()} text-white flex flex-col h-screen shadow-lg`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${getBorderColor()}`}>
        <div className="flex items-center">
          <Building className="h-6 w-6 text-white mr-2" />
          <div>
            <h1 className="text-sm font-bold text-white">{getLocalizedText('ownerSpace')}</h1>
            <p className="text-xs text-white/80">{ownerProfile?.name || 'Propriétaire'}</p>
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
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <OwnerQuickActions 
              ownerProfile={ownerProfile} 
              setActiveView={setActiveView}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${getBorderColor()} flex-shrink-0`}>
        <div className="text-center">
          <div className="text-white text-sm font-medium animate-pulse">
            NEOTECH-CONSULTING
          </div>
          <div className="text-white/70 text-xs mt-1">
            Version 1.0 • {currentYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceQuickActionsSidebar;
