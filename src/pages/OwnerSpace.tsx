
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useOwnerPermissions } from '@/hooks/useOwnerPermissions';
import OwnerSpaceProfileHeader from '@/components/OwnerSpace/OwnerSpaceProfileHeader';
import ViewRenderer from '@/components/OwnerSpace/Views/ViewRenderer';

const OwnerSpace = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProfile, userType, user } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();
  const { canAccessOwnerSpace, canAccessOwnData } = useOwnerPermissions();
  const [activeView, setActiveView] = useState('dashboard');

  // Get current profile (logged user or profile selected by admin)
  const currentProfile = getCurrentProfile();
  
  // Pour les propriétaires, utiliser leur propre profil ou créer un profil par défaut
  const ownerProfile = userType === 'owner' && !isAuthorizedAdmin 
    ? userProfile || {
        id: user?.uid || 'owner-default',
        name: user?.displayName || user?.email || 'Propriétaire',
        email: user?.email || '',
        role: 'owner',
        type: 'owner',
        isOwner: true
      }
    : currentProfile;

  // Debug: Log profile data
  console.log('🏠 OwnerSpace - userProfile:', userProfile);
  console.log('🏠 OwnerSpace - currentProfile:', currentProfile);
  console.log('🏠 OwnerSpace - ownerProfile:', ownerProfile);
  console.log('🏠 OwnerSpace - userType:', userType);
  console.log('🏠 OwnerSpace - isAuthorizedAdmin:', isAuthorizedAdmin);
  console.log('🏠 OwnerSpace - user:', user?.email);

  // Vérifier les permissions d'accès à l'espace propriétaire
  const hasAccess = canAccessOwnerSpace();
  
  // Vérifications d'accès
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h2>
            <p className="text-lg text-gray-600 mb-2">Cet espace est réservé aux propriétaires et administrateurs.</p>
            <p className="text-gray-500 mb-6">
              {userType === 'locataire' || userType === 'colocataire' 
                ? "En tant que locataire/colocataire, vous avez accès à votre espace personnel."
                : "Veuillez vous connecter avec un compte propriétaire."
              }
            </p>
            <div className="space-x-4">
              {(userType === 'locataire' || userType === 'colocataire') && (
                <Button onClick={() => navigate('/tenant-space')} className="mr-2">
                  Aller à mon espace
                </Button>
              )}
              <Button onClick={() => navigate('/login')} variant="outline">
                Retour à la connexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex w-full bg-gray-50">
      {/* Main content area - full width without sidebar */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Owner space header */}
        <OwnerSpaceProfileHeader currentProfile={ownerProfile} />

        {/* Main content */}
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
