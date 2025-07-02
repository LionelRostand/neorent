
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { getIconComponent } from './iconUtils';

interface ConfigurableQuickActionItemProps {
  action: any;
  onToggle?: (actionId: string) => void;
  onRemove?: (actionId: string) => void;
  onClick?: (action: any) => void;
  showControls?: boolean;
  isDragging?: boolean;
}

const ConfigurableQuickActionItem: React.FC<ConfigurableQuickActionItemProps> = ({
  action,
  onToggle,
  onRemove,
  onClick,
  showControls = false,
  isDragging = false
}) => {
  const { i18n } = useTranslation();

  // Get the appropriate icon component
  const IconComponent = getIconComponent(action.icon);

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      toggle: {
        fr: 'Basculer',
        en: 'Toggle'
      },
      remove: {
        fr: 'Supprimer',
        en: 'Remove'
      },
      configure: {
        fr: 'Configurer',
        en: 'Configure'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(action);
    }
  };

  const handleToggle = (checked: boolean) => {
    if (onToggle) {
      onToggle(action.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(action.id);
    }
  };

  return (
    <div className={`relative group ${isDragging ? 'opacity-75 transform rotate-1' : ''}`}>
      <button
        onClick={handleClick}
        className="w-full flex items-center p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-left border border-white/20"
      >
        <div className={`p-2 md:p-3 rounded ${action.color} mr-3 md:mr-4 flex-shrink-0`}>
          <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white text-sm md:text-base truncate">
            {action.title}
          </div>
          <div className="text-xs md:text-sm text-white/70 truncate">
            {action.description}
          </div>
          {action.preview && (
            <div className="text-xs text-green-200 font-medium mt-1 truncate">
              {action.preview}
            </div>
          )}
        </div>
      </button>

      {/* Admin Controls */}
      {showControls && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Switch
            checked={action.enabled}
            onCheckedChange={handleToggle}
            className="scale-75"
            title={getLocalizedText('toggle')}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
            title={getLocalizedText('remove')}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConfigurableQuickActionItem;
