
import React from 'react';
import { Button } from '@/components/ui/button';
import { QuickAction } from './quickActionsConfig';

interface QuickActionItemProps {
  action: QuickAction;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ action }) => {
  const Icon = action.icon;

  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-3 hover:bg-gray-50 rounded-lg border-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Clicking action: ${action.id}`);
        action.action();
      }}
    >
      <div className="flex items-center space-x-3 w-full min-w-0">
        <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-left flex-1 min-w-0 overflow-hidden">
          <p className="font-medium text-gray-900 text-sm leading-tight truncate">{action.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{action.description}</p>
          <p className="text-xs text-blue-600 font-medium mt-1">{action.preview}</p>
        </div>
      </div>
    </Button>
  );
};

export default QuickActionItem;
