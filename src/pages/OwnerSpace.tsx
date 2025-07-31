
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useOwnerPermissions } from '@/hooks/useOwnerPermissions';
import { useIsMobile } from '@/hooks/use-mobile';
import OwnerSpaceQuickActionsSidebar from '@/components/OwnerSpace/OwnerSpaceQuickActionsSidebar';
import OwnerSpaceProfileHeader from '@/components/OwnerSpace/OwnerSpaceProfileHeader';
import ViewRenderer from '@/components/OwnerSpace/Views/ViewRenderer';

const OwnerSpace = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProfile, userType } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();
  const { canAccessOwnerSpace } = useOwnerPermissions();
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState('properties');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  // Get current profile (logged user or profile selected by admin)
  const currentProfile = getCurrentProfile();

  // Debug: Log profile data
  console.log('OwnerSpace - userProfile:', userProfile);
  console.log('OwnerSpace - currentProfile:', currentProfile);
  console.log('OwnerSpace - userType:', userType);
  console.log('OwnerSpace - isAuthorizedAdmin:', isAuthorizedAdmin);

  // Vérifier les permissions d'accès à l'espace propriétaire
  const hasAccess = canAccessOwnerSpace();
  
  if (!hasAccess || !currentProfile) {
    return (
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Accès non autorisé</p>
            <p className="text-gray-500">Cet espace est réservé aux propriétaires et administrateurs.</p>
            <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pages that should be completely full-screen without any sidebar, header, or NeoRent branding
  const fullScreenPages = ['messages', 'forecasting'];
  const isFullScreenPage = fullScreenPages.includes(activeView);

  // If it's a full-screen page, render only the view content with no interface elements
  if (isFullScreenPage) {
    return (
      <ViewRenderer 
        activeView={activeView}
        currentProfile={currentProfile}
        onViewChange={setActiveView}
      />
    );
  }

  // Regular layout for other pages (dashboard, properties, etc.)
  return (
    <div className="h-screen flex w-full bg-gray-50 relative">

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Quick actions sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'flex-shrink-0'} 
        h-full transition-transform duration-300 ease-in-out
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <OwnerSpaceQuickActionsSidebar 
          ownerProfile={currentProfile} 
          activeView={activeView}
          setActiveView={setActiveView}
          onMobileClose={isMobile ? () => setSidebarOpen(false) : undefined}
        />
      </div>
      
      {/* Main content area - full height, conditional layout */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Mobile menu button */}
        {isMobile && (
          <div className="bg-white border-b px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="mr-3"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Espace Propriétaire
            </h1>
          </div>
        )}

        {/* Owner space header */}
        {!isMobile && <OwnerSpaceProfileHeader currentProfile={currentProfile} />}

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <ViewRenderer 
            activeView={activeView}
            currentProfile={currentProfile}
            onViewChange={setActiveView}
          />
        </main>
      </div>
    </div>
  );
};

export default OwnerSpace;
