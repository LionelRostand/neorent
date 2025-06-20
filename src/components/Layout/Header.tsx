
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Home, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileDropdown } from './UserProfile/UserProfileDropdown';
import { MessageNotification } from '@/components/Messages/MessageNotification';
import LanguageSelector from '@/components/LanguageSelector';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, userType } = useAuth();
  
  // Vérifier si l'utilisateur est un admin ou employé
  const isAdminOrEmployee = userType === 'admin' || userType === 'employee' || user?.email === 'admin@neotech-consulting.com';

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
          {isAdminOrEmployee && (
            <Link to="/admin">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs px-2 py-1 h-8"
              >
                <Settings className="h-3 w-3" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
          <LanguageSelector />
          <MessageNotification />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
