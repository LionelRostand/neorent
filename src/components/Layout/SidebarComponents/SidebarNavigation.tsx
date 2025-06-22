
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useSidebarMenuItems } from './useSidebarMenuItems';

interface SidebarNavigationProps {
  onMobileClose?: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ onMobileClose }) => {
  const location = useLocation();
  const { canAccessMenu } = useUserPermissions();
  const menuItems = useSidebarMenuItems();

  const isActive = (path: string) => location.pathname === path;

  const filteredMenuItems = menuItems.filter(item => canAccessMenu(item.permission));

  return (
    <nav className="space-y-2 py-4 px-3">
      {filteredMenuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive(item.path)
                ? 'bg-green-400 text-white'
                : 'text-white/90 hover:text-white hover:bg-green-400/50'
            }`}
            onClick={onMobileClose}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
