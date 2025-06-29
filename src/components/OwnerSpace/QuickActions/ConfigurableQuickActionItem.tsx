
import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import * as Icons from 'lucide-react';

interface ConfigurableQuickActionItemProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  actionId: string;
  showControls?: boolean;
  isDragging?: boolean;
}

const ConfigurableQuickActionItem: React.FC<ConfigurableQuickActionItemProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  actionId,
  showControls = false,
  isDragging = false
}) => {
  const { removeAction, isAdmin } = useQuickActionsManager();
  
  // Import dynamically based on icon name using ES6 imports
  const IconComponent = React.useMemo(() => {
    try {
      // Safely get the icon from the Icons object
      if (icon && Icons[icon as keyof typeof Icons]) {
        return Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
      }
      return Icons.Settings;
    } catch {
      return Icons.Settings;
    }
  }, [icon]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette action rapide ?')) {
      await removeAction(actionId);
    }
  };

  return (
    <div 
      className={`relative group flex items-center p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 cursor-pointer border border-white/20 ${
        isDragging ? 'shadow-lg scale-105 bg-white/20' : ''
      }`}
      onClick={onClick}
    >
      {/* Drag Handle for admins */}
      {(isAdmin || showControls) && (
        <div className="flex items-center mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-white/60 cursor-grab" />
        </div>
      )}
      
      {/* Icon */}
      <div className={`p-2 md:p-3 rounded-lg ${color} mr-3 md:mr-4 flex-shrink-0`}>
        <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white text-sm md:text-base truncate">{title}</h4>
        <p className="text-white/70 text-xs md:text-sm truncate">{description}</p>
      </div>
      
      {/* Delete button for admins */}
      {showControls && isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default ConfigurableQuickActionItem;
