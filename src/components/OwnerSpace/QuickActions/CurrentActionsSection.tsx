
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2, Edit } from 'lucide-react';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';
import { getIconForPath } from '@/utils/menuIconMapping';

interface CurrentActionsSectionProps {
  quickActions: QuickActionConfig[];
  onToggleAction: (actionId: string) => Promise<void>;
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

  const getLocalizedActionText = (action: QuickActionConfig, field: 'title' | 'description'): string => {
    const key = field === 'title' ? action.titleKey : action.descriptionKey;
    return t(key, key);
  };

  const handleToggleAction = async (actionId: string) => {
    console.log('Toggling action:', actionId);
    await onToggleAction(actionId);
  };

  const handleRemoveClick = async (actionId: string) => {
    if (window.confirm(t('quickActions.manager.removeError'))) {
      await onRemoveAction(actionId);
    }
  };

  const handleConfigureClick = (actionId: string) => {
    console.log('Configure action:', actionId);
    onConfigureAction(actionId);
  };

  const renderActionIcon = (action: QuickActionConfig) => {
    // Try to get the icon from the path mapping if it's a navigation action
    if (action.action === 'navigate' && action.actionValue) {
      const IconComponent = getIconForPath(action.actionValue);
      if (IconComponent) {
        return <IconComponent className="h-5 w-5 text-white" />;
      }
    }
    
    // Fallback to Settings icon
    return <Settings className="h-5 w-5 text-white" />;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          {t('quickActions.manager.currentActions')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <div 
            key={action.id} 
            className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white"
          >
            {/* Icon */}
            <div className={`p-3 rounded-lg ${action.color} flex-shrink-0`}>
              {renderActionIcon(action)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-base">
                    {getLocalizedActionText(action, 'title')}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {getLocalizedActionText(action, 'description')}
                  </p>
                  <Badge 
                    variant={action.enabled ? "default" : "secondary"} 
                    className="text-xs mt-2"
                  >
                    {action.enabled 
                      ? t('quickActions.manager.enabled') 
                      : t('quickActions.manager.disabled')
                    }
                  </Badge>
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={() => handleToggleAction(action.id)}
                    disabled={toggleStates[action.id] || saving}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConfigureClick(action.id)}
                    disabled={saving}
                    className="h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveClick(action.id)}
                    disabled={saving}
                    className="h-9 w-9 p-0 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {quickActions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">{t('quickActions.manager.noActionsConfigured')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentActionsSection;
