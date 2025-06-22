
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import SidebarHeader from './SidebarComponents/SidebarHeader';
import SidebarNavigation from './SidebarComponents/SidebarNavigation';
import SidebarQuickActions from './SidebarComponents/SidebarQuickActions';
import SidebarFooter from './SidebarComponents/SidebarFooter';

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
    <div className="bg-green-500 w-64 h-screen flex flex-col">
      <SidebarHeader />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarNavigation onMobileClose={onMobileClose} />
          <SidebarQuickActions onMobileClose={onMobileClose} />
        </ScrollArea>
      </div>

      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
