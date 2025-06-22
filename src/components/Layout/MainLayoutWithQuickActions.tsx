
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import Header from './Header';
import Sidebar from './Sidebar';
import QuickActionsSidebar from './QuickActionsSidebar';
import SidebarToggle from './SidebarToggle';

interface MainLayoutWithQuickActionsProps {
  children: React.ReactNode;
}

const MainLayoutWithQuickActions: React.FC<MainLayoutWithQuickActionsProps> = ({ children }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { userType } = useAuth();
  const { isAdmin } = useUserPermissions();

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  // Vérifier si l'utilisateur peut voir les actions rapides
  const canShowQuickActions = userType === 'employee' || isAdmin;

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar normale pour les admins */}
      {isAdmin && !showQuickActions && <Sidebar />}
      
      {/* Sidebar des actions rapides */}
      {canShowQuickActions && (
        <>
          <QuickActionsSidebar 
            isOpen={showQuickActions} 
            onClose={() => setShowQuickActions(false)} 
          />
          <SidebarToggle 
            onToggleQuickActions={toggleQuickActions}
            showQuickActions={showQuickActions}
          />
        </>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayoutWithQuickActions;
