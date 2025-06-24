
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import SidebarHeader from './SidebarComponents/SidebarHeader';
import SidebarNavigation from './SidebarComponents/SidebarNavigation';
import SidebarFooter from './SidebarComponents/SidebarFooter';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onMobileClose }) => {
  const { isAdmin } = useUserPermissions();

  // Si l'utilisateur n'est pas admin, ne pas afficher la sidebar
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-green-500 w-64 h-screen flex flex-col relative">
      {/* Mobile close button */}
      {onMobileClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileClose}
          className="absolute top-2 right-2 z-10 lg:hidden text-white hover:bg-green-600"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <SidebarHeader />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarNavigation onMobileClose={onMobileClose} />
        </ScrollArea>
      </div>

      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
