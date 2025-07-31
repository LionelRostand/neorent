
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { MessageToast } from '@/components/Messages/MessageToast';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userType } = useAuth();
  const location = useLocation();

  // Ne pas afficher la sidebar NEORENT dans l'espace propriétaire
  const isOwnerSpace = location.pathname.startsWith('/owner-space');
  
  // Vérifier si l'utilisateur doit voir la sidebar (mais pas dans l'espace propriétaire)
  const shouldShowSidebar = (userType === 'admin' || user?.email === 'admin@neotech-consulting.com') && !isOwnerSpace;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button - visible only on small screens when sidebar should be shown */}
      {shouldShowSidebar && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {/* Mobile overlay */}
      {isSidebarOpen && shouldShowSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - only show if user should see it */}
      {shouldShowSidebar && (
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}>
          <Sidebar onMobileClose={closeSidebar} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={shouldShowSidebar ? toggleSidebar : undefined} />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          {children}
        </main>
      </div>

      {/* Message notifications */}
      <MessageToast />
    </div>
  );
};

export default MainLayout;
