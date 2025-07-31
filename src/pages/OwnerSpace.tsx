
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useOwnerPermissions } from '@/hooks/useOwnerPermissions';
import OwnerSpaceQuickActionsSidebar from '@/components/OwnerSpace/OwnerSpaceQuickActionsSidebar';
import OwnerSpaceProfileHeader from '@/components/OwnerSpace/OwnerSpaceProfileHeader';
import ViewRenderer from '@/components/OwnerSpace/Views/ViewRenderer';

const OwnerSpace = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProfile, userType } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();
  const { canAccessOwnerSpace } = useOwnerPermissions();
  const [activeView, setActiveView] = useState('properties');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const fullScreenPages = ['messages', 'website', 'forecasting'];
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
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Quick actions sidebar - responsive with same height as main content */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        transition-transform duration-300 ease-in-out
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        flex-shrink-0 h-full
      `}>
        <OwnerSpaceQuickActionsSidebar 
          ownerProfile={currentProfile} 
          activeView={activeView}
          setActiveView={setActiveView}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      
      {/* Main content area - full height, conditional layout */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Owner space header */}
        <OwnerSpaceProfileHeader currentProfile={currentProfile} />

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
