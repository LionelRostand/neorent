
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { QuickAction } from './quickActionsConfig';

interface QuickActionItemProps {
  action: QuickAction;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ action }) => {
  const { i18n } = useTranslation();
  const { isAdmin, removeAction } = useQuickActionsManager();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      delete: {
        fr: 'Supprimer',
        en: 'Delete'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeAction(action.id);
  };

  const IconComponent = action.icon;

  return (
    <div className="relative group">
      <button
        onClick={action.action}
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
      </button>
      
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title={getLocalizedText('delete')}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default QuickActionItem;
