
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfileDropdown } from './UserProfile/UserProfileDropdown';
import { MessageNotification } from '@/components/Messages/MessageNotification';
import LanguageSelector from '@/components/LanguageSelector';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2 p-1 sm:p-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-1 sm:mr-2" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              <span className="hidden sm:inline">NeoRent Admin</span>
              <span className="sm:hidden">NeoRent</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <MessageNotification />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
