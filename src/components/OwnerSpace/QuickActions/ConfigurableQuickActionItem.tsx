
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';

interface ConfigurableQuickActionItemProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  actionId?: string;
  showControls?: boolean;
}

const ConfigurableQuickActionItem: React.FC<ConfigurableQuickActionItemProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick,
  actionId,
  showControls = false
}) => {
  const { i18n } = useTranslation();
  const { removeAction, isAdmin } = useQuickActionsManager();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      remove: {
        fr: 'Supprimer',
        en: 'Remove'
      },
      confirmDelete: {
        fr: 'Êtes-vous sûr de vouloir supprimer cette action ?',
        en: 'Are you sure you want to delete this action?'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!actionId) {
      console.log('No actionId provided for removal');
      return;
    }
    
    console.log('Attempting to remove action:', actionId);
    
    if (window.confirm(getLocalizedText('confirmDelete'))) {
      await removeAction(actionId);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-500/10 rounded-lg transition-colors bg-white/5"
      >
        <div className={`p-2 rounded-lg ${color}`}>
          <Settings className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-white/70">{description}</div>
        </div>
      </button>

      {/* Delete button - visible to admins when showControls is true and actionId exists */}
      {showControls && isAdmin && actionId && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="absolute top-1 right-1 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-100 hover:opacity-90 transition-all duration-200 shadow-lg z-10"
          title={getLocalizedText('remove')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ConfigurableQuickActionItem;
