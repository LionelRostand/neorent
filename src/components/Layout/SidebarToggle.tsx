
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Zap } from 'lucide-react';

interface SidebarToggleProps {
  onToggleQuickActions: () => void;
  showQuickActions: boolean;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ 
  onToggleQuickActions, 
  showQuickActions 
}) => {
  return (
    <div className="fixed top-4 left-4 z-40 lg:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleQuickActions}
        className="bg-white shadow-md"
      >
        {showQuickActions ? <Menu className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SidebarToggle;
