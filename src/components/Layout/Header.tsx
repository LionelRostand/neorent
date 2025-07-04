
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import UserProfile from './UserProfile';
import LanguageSelector from '../LanguageSelector';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {/* Mobile menu button - hidden on large screens where sidebar is always visible */}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <h1 className="text-xl font-semibold text-gray-900">
          {t('navigation.dashboard')}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <UserProfile />
      </div>
    </header>
  );
};

export default Header;
