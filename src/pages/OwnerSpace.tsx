
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
  const { userProfile, userType, user } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();
  const { canAccessOwnerSpace, canAccessOwnData } = useOwnerPermissions();
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get current profile (logged user or profile selected by admin)
  const currentProfile = getCurrentProfile();
  
  // Pour les propriétaires, utiliser leur propre profil
  const ownerProfile = userType === 'owner' && !isAuthorizedAdmin ? userProfile : currentProfile;

  // Debug: Log profile data
  console.log('OwnerSpace - userProfile:', userProfile);
  console.log('OwnerSpace - currentProfile:', currentProfile);
  console.log('OwnerSpace - ownerProfile:', ownerProfile);
  console.log('OwnerSpace - userType:', userType);
  console.log('OwnerSpace - isAuthorizedAdmin:', isAuthorizedAdmin);

  // Vérifier les permissions d'accès à l'espace propriétaire
  const hasAccess = canAccessOwnerSpace();
  const hasOwnData = canAccessOwnData();
  
  // Vérifications d'accès
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Accès non autorisé</p>
            <p className="text-gray-500">Cet espace est réservé aux propriétaires et administrateurs.</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Si c'est un propriétaire mais qu'il n'a pas de profil configuré
  if (userType === 'owner' && !ownerProfile && !isAuthorizedAdmin) {
    return (
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Profil en cours de configuration</p>
            <p className="text-gray-500">Votre espace propriétaire est en cours de configuration. Veuillez contacter votre administrateur.</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        md:block flex-shrink-0 h-full
      `}>
        <OwnerSpaceQuickActionsSidebar 
          ownerProfile={ownerProfile} 
          activeView={activeView}
          setActiveView={setActiveView}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      
      {/* Main content area - full height, no additional headers */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile menu button - only for mobile */}
        <div className="md:hidden bg-white border-b px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Owner space header - this is the ONLY header we want */}
        <OwnerSpaceProfileHeader currentProfile={ownerProfile} />

        {/* Main content - each view renders without any additional layout */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <ViewRenderer 
            activeView={activeView}
            currentProfile={ownerProfile}
            onViewChange={setActiveView}
          />
        </main>
      </div>
    </div>
  );
};

export default OwnerSpace;
