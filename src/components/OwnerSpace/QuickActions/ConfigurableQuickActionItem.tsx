
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { QuickAction } from './quickActionsConfig';
import FormButtonConfig from './FormButtonConfig';

interface ConfigurableQuickActionItemProps {
  action: QuickAction;
}

const ConfigurableQuickActionItem: React.FC<ConfigurableQuickActionItemProps> = ({ action }) => {
  const { i18n } = useTranslation();
  const { isAdmin, removeAction } = useQuickActionsManager();
  const { getButtonConfig, saveButtonConfig } = useFormButtonConfig();
  const [showConfig, setShowConfig] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(getButtonConfig(action.id));

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      delete: {
        fr: 'Supprimer',
        en: 'Delete'
      },
      configure: {
        fr: 'Configurer',
        en: 'Configure'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    removeAction(action.id);
  };

  const handleConfigSave = async (newConfig: any) => {
    const success = await saveButtonConfig(action.id, newConfig);
    if (success) {
      setCurrentConfig(newConfig);
    }
  };

  const IconComponent = action.icon;

  return (
    <div className="relative group">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          action.action();
        }}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
      >
        <div className={`p-2 rounded-lg ${action.color}`}>
          <IconComponent className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{action.title}</div>
          <div className="text-xs text-white/70">{action.description}</div>
          <div className="text-xs text-white/50 mt-1">{action.preview}</div>
        </div>
        
        {/* Boutons d'administration - visibles au hover */}
        {isAdmin && (
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Popover open={showConfig} onOpenChange={setShowConfig}>
              <PopoverTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowConfig(true);
                  }}
                  className="p-1.5 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full shadow-lg border border-white/20"
                  title={getLocalizedText('configure')}
                >
                  <Settings className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" className="p-0">
                <FormButtonConfig
                  actionId={action.id}
                  currentConfig={currentConfig}
                  onConfigChange={setCurrentConfig}
                  onClose={() => setShowConfig(false)}
                />
              </PopoverContent>
            </Popover>
            
            <button
              onClick={handleDelete}
              className="p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg border border-white/20"
              title={getLocalizedText('delete')}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </button>
    </div>
  );
};

export default ConfigurableQuickActionItem;
