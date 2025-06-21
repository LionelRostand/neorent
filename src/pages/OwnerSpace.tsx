
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import OwnerSpaceHeader from '@/components/OwnerSpace/OwnerSpaceHeader';
import OwnerSpaceTabs from '@/components/OwnerSpace/OwnerSpaceTabs';

const OwnerSpace = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { userProfile, userType } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();

  // Obtenir le profil actuel (utilisateur connecté ou profil sélectionné par l'admin)
  const currentProfile = getCurrentProfile();

  // Vérifier que l'utilisateur est bien un propriétaire/employé ou un administrateur
  if ((userType !== 'employee' && userType !== 'admin') || !currentProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600">Accès non autorisé</p>
            <p className="text-gray-500">Cet espace est réservé aux propriétaires.</p>
            <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <OwnerSpaceHeader 
          ownerProfile={currentProfile}
        />

        <OwnerSpaceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ownerProfile={currentProfile}
        />
      </div>
    </MainLayout>
  );
};

export default OwnerSpace;
