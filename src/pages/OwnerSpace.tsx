
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import Header from '@/components/Layout/Header';
import OwnerSpaceQuickActionsSidebar from '@/components/OwnerSpace/OwnerSpaceQuickActionsSidebar';
import OwnerSpaceProfileHeader from '@/components/OwnerSpace/OwnerSpaceProfileHeader';
import ViewRenderer from '@/components/OwnerSpace/Views/ViewRenderer';

const OwnerSpace = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProfile, userType } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();
  const [activeView, setActiveView] = useState('dashboard');

  // Obtenir le profil actuel (utilisateur connecté ou profil sélectionné par l'admin)
  const currentProfile = getCurrentProfile();

  // Vérifier que l'utilisateur est bien un propriétaire/employé ou un administrateur
  if ((userType !== 'employee' && userType !== 'admin') || !currentProfile) {
    return (
      <div className="min-h-screen flex w-full">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">{t('ownerSpace.unauthorized')}</p>
            <p className="text-gray-500">{t('ownerSpace.unauthorizedDescription')}</p>
            <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
              {t('ownerSpace.backToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar des actions rapides - responsive */}
      <div className="hidden md:block flex-shrink-0">
        <OwnerSpaceQuickActionsSidebar 
          ownerProfile={currentProfile} 
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="bg-gray-50 min-h-full">
            {/* Header avec profil propriétaire */}
            <OwnerSpaceProfileHeader currentProfile={currentProfile} />

            {/* Contenu principal avec padding responsive */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pb-6 lg:pb-8">
              <ViewRenderer 
                activeView={activeView}
                currentProfile={currentProfile}
                onViewChange={setActiveView}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar mobile - affichée en mode drawer sur mobile */}
      <div className="md:hidden">
        {/* Bouton pour ouvrir le menu mobile pourrait être ajouté ici si nécessaire */}
      </div>
    </div>
  );
};

export default OwnerSpace;
