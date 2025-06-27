
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';

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
      configure: {
        fr: 'Configurer',
        en: 'Configure'
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
    
    if (!actionId) return;
    
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

      {/* Controls - visible on hover if showControls is true and user is admin */}
      {showControls && isAdmin && actionId && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-black/20 hover:bg-black/40 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRemove}
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-3 w-3 mr-2" />
                  {getLocalizedText('remove')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default ConfigurableQuickActionItem;
