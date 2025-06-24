
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfileDropdown } from './UserProfile/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onToggleOwnerSidebar?: () => void;
  showOwnerSidebarToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onToggleOwnerSidebar, 
  showOwnerSidebarToggle = false 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-1 sm:mr-2" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              <span className="hidden sm:inline">NeoRent Admin</span>
              <span className="sm:hidden">NeoRent</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <LanguageSelector />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
