
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2, Edit } from 'lucide-react';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';

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
  const { i18n } = useTranslation();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      currentActions: {
        fr: 'Actions rapides actuelles',
        en: 'Current quick actions'
      },
      enabled: {
        fr: 'Activé',
        en: 'Enabled'
      },
      disabled: {
        fr: 'Désactivé',
        en: 'Disabled'
      },
      configure: {
        fr: 'Configurer',
        en: 'Configure'
      },
      remove: {
        fr: 'Supprimer',
        en: 'Remove'
      },
      noActions: {
        fr: 'Aucune action rapide configurée',
        en: 'No quick actions configured'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Helper function to get localized title and description
  const getLocalizedActionText = (action: QuickActionConfig, field: 'title' | 'description') => {
    const currentLang = i18n.language as 'fr' | 'en';
    
    if (typeof action[field] === 'object' && action[field] !== null) {
      return action[field][currentLang] || action[field]['fr'] || action[field];
    }
    
    return action[field] || '';
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base sm:text-lg font-semibold">{getLocalizedText('currentActions')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <div key={action.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded ${action.color} flex-shrink-0`}>
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {getLocalizedActionText(action, 'title')}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {getLocalizedActionText(action, 'description')}
                </div>
                <Badge variant={action.enabled ? "default" : "secondary"} className="text-xs mt-1">
                  {action.enabled ? getLocalizedText('enabled') : getLocalizedText('disabled')}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  checked={action.enabled}
                  onCheckedChange={() => onToggleAction(action.id)}
                  disabled={toggleStates[action.id] || saving}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onConfigureAction(action.id)}
                  disabled={saving}
                  title={getLocalizedText('configure')}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemoveAction(action.id)}
                  disabled={saving}
                  title={getLocalizedText('remove')}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {quickActions.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p className="text-sm">{getLocalizedText('noActions')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentActionsSection;
