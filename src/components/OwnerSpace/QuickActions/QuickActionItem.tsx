
import React from 'react';

interface QuickActionItemProps {
  action: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    action: () => void;
    preview?: string;
  };
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ action }) => {
  const Icon = action.icon;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        action.action();
      }}
      className="w-full flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 text-white/90 hover:text-white hover:bg-green-500/30 group"
    >
      <div className={`p-2.5 rounded-lg ${action.color} mr-3 flex-shrink-0 group-hover:scale-105 transition-transform`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="font-semibold text-sm text-white truncate mb-0.5">
          {action.title}
        </div>
        <div className="text-xs text-green-100/80 leading-tight mb-1">
          {action.description}
        </div>
        {action.preview && (
          <div className="text-xs text-green-200 font-medium bg-green-500/20 px-2 py-0.5 rounded-full inline-block">
            {action.preview}
          </div>
        )}
      </div>
    </button>
  );
};

export default QuickActionItem;
