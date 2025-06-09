
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { UserProfileDropdown } from './UserProfile/UserProfileDropdown';
import { MessageNotification } from '@/components/Messages/MessageNotification';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">NeoRent Admin</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <MessageNotification />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
