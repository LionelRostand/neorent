
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';

interface ConfigurableQuickActionItemProps {
  action: QuickActionConfig;
  onToggle?: (actionId: string) => void;
  onRemove?: (actionId: string) => void;
  onClick?: (action: QuickActionConfig) => void;
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
  const { t } = useTranslation();

  const getLocalizedText = (key: string): string => {
    return t(key, key);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(action);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(action.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(action.id);
    }
  };

  return (
    <div className={`relative group ${isDragging ? 'opacity-75' : ''}`}>
      <div
        onClick={handleClick}
        className="w-full bg-white/10 hover:bg-white/20 rounded-lg p-3 md:p-4 transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {showControls && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="h-4 w-4 text-white/60" />
              </div>
            )}
            
            <div className={`p-2 rounded-lg ${action.color} flex-shrink-0`}>
              {/* Icon will be rendered by parent component */}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-medium text-white truncate">
                {getLocalizedText(action.titleKey)}
              </h4>
              <p className="text-xs md:text-sm text-white/70 truncate">
                {getLocalizedText(action.descriptionKey)}
              </p>
              {action.preview && (
                <p className="text-xs text-green-200 font-medium mt-1 truncate">
                  {action.preview}
                </p>
              )}
            </div>
          </div>

          {showControls && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Switch
                checked={action.enabled}
                onCheckedChange={handleToggle}
                size="sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0 hover:bg-red-500/20 text-white hover:text-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurableQuickActionItem;
