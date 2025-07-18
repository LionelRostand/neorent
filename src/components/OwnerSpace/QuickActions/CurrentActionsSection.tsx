
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
  const { i18n, t } = useTranslation();

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
      },
      confirmDelete: {
        fr: 'Êtes-vous sûr de vouloir supprimer cette action ?',
        en: 'Are you sure you want to delete this action?'
      },
      visibleInSidebar: {
        fr: 'Visible dans la sidebar',
        en: 'Visible in sidebar'
      },
      hiddenFromSidebar: {
        fr: 'Masqué de la sidebar',
        en: 'Hidden from sidebar'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const getLocalizedActionText = (action: QuickActionConfig, field: 'title' | 'description'): string => {
    const key = field === 'title' ? action.titleKey : action.descriptionKey;
    return t(key, key);
  };

  const handleToggleAction = async (actionId: string) => {
    console.log('Toggling action:', actionId);
    await onToggleAction(actionId);
  };

  const handleRemoveClick = async (actionId: string) => {
    if (window.confirm(getLocalizedText('confirmDelete'))) {
      await onRemoveAction(actionId);
    }
  };

  const handleConfigureClick = (actionId: string) => {
    console.log('Configure action:', actionId);
    onConfigureAction(actionId);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          {getLocalizedText('currentActions')}
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
              <Settings className="h-5 w-5 text-white" />
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
                    {action.enabled ? getLocalizedText('visibleInSidebar') : getLocalizedText('hiddenFromSidebar')}
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
            <p className="text-sm">{getLocalizedText('noActions')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentActionsSection;
