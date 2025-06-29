
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  Users, 
  Globe, 
  Settings,
  Building,
  DollarSign,
  Calculator,
  UserCheck,
  ClipboardList,
  Receipt,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Plus,
  FileText,
  Users,
  Globe,
  Settings,
  Building,
  DollarSign,
  Calculator,
  UserCheck,
  ClipboardList,
  Receipt,
  TrendingUp,
  HelpCircle
};

interface ConfigurableQuickActionItemProps {
  action: any;
  onToggle: (actionId: string) => void;
  onRemove: (actionId: string) => void;
  onClick: (action: any) => void;
  showControls: boolean;
  isDragging?: boolean;
}

const ConfigurableQuickActionItem: React.FC<ConfigurableQuickActionItemProps> = ({
  action,
  onToggle,
  onRemove,
  onClick,
  showControls,
  isDragging = false
}) => {
  const { t } = useTranslation();
  const IconComponent = iconMap[action.icon as keyof typeof iconMap] || LayoutDashboard;

  // Get localized text using translation keys
  const getLocalizedText = (key: string) => {
    return t(key, key);
  };

  const handleCardClick = () => {
    if (!showControls) {
      onClick(action);
    }
  };

  return (
    <Card 
      className={`
        ${isDragging ? 'opacity-50' : ''} 
        ${showControls 
          ? 'border-2 border-dashed border-gray-300 bg-gray-50' 
          : 'hover:shadow-md cursor-pointer transition-shadow'
        }
      `}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
            <IconComponent className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {getLocalizedText(action.titleKey)}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {getLocalizedText(action.descriptionKey)}
            </p>
          </div>

          {showControls && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Switch
                checked={action.enabled}
                onCheckedChange={() => onToggle(action.id)}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(action.id);
                }}
              >
                Supprimer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurableQuickActionItem;
