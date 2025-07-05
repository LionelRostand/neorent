
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Trash2, Loader2 } from 'lucide-react';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';
import * as Icons from 'lucide-react';

interface CurrentActionsSectionProps {
  quickActions: QuickActionConfig[];
  onToggleAction: (actionId: string) => void;
  onRemoveAction: (actionId: string) => Promise<boolean>;
  onConfigureAction: (actionId: string) => void;
  toggleStates: Record<string, boolean>;
  saving: boolean;
}

const CurrentActionsSection: React.FC<CurrentActionsSectionProps> = ({
  quickActions,
  onToggleAction,
  onRemoveAction,
  onConfigureAction,
  toggleStates,
  saving
}) => {
  const { t } = useTranslation();

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Settings;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
        {t('quickActions.manager.currentActions')}
      </h3>
      
      {quickActions.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Settings className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-500">
            {t('quickActions.manager.noActionsConfigured')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const IconComponent = getIconComponent(action.icon);
            return (
              <div
                key={action.id}
                className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className={`p-2 rounded-lg ${action.color} flex-shrink-0`}>
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={() => onToggleAction(action.id)}
                    disabled={toggleStates[action.id] || saving}
                    className="ml-2"
                  />
                </div>
                
                <div className="mb-2 sm:mb-3">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {t(action.titleKey)}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                    {t(action.descriptionKey)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    action.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {action.enabled ? t('quickActions.manager.enabled') : t('quickActions.manager.disabled')}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfigureAction(action.id)}
                      disabled={saving}
                      className="h-8 w-8 p-0"
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAction(action.id)}
                      disabled={saving}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {toggleStates[action.id] ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentActionsSection;
