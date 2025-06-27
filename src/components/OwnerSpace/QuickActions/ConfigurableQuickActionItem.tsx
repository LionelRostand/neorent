
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';

interface ConfigurableQuickActionItemProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const ConfigurableQuickActionItem: React.FC<ConfigurableQuickActionItemProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick 
}) => {
  const { i18n } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 rounded-lg transition-colors"
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Settings className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="text-xs text-white/70">{description}</div>
      </div>
    </button>
  );
};

export default ConfigurableQuickActionItem;
