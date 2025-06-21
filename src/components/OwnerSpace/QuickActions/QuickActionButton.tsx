
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick
}) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-0 hover:bg-transparent"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 w-full min-w-0">
        <div className={`p-2 rounded-lg ${color} text-white flex-shrink-0`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-left flex-1 min-w-0 overflow-hidden">
          <p className="font-medium text-gray-900 text-sm leading-tight truncate">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
        </div>
      </div>
    </Button>
  );
};

export default QuickActionButton;
