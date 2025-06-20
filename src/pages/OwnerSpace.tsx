
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import OwnerSpaceHeader from '@/components/OwnerSpace/OwnerSpaceHeader';
import OwnerSpaceTabs from '@/components/OwnerSpace/OwnerSpaceTabs';

const OwnerSpace = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { userProfile, userType, getDefaultRoute } = useAuth();

  // Vérifier que l'utilisateur est bien un propriétaire ou admin
  if (userType !== 'employee' && userType !== 'admin') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600">Accès non autorisé</p>
            <p className="text-gray-500">Cet espace est réservé aux propriétaires.</p>
            <Button onClick={() => navigate(getDefaultRoute())} className="mt-4">
              Retour
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!userProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <OwnerSpaceHeader 
          ownerProfile={userProfile}
        />

        <OwnerSpaceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ownerProfile={userProfile}
        />
      </div>
    </MainLayout>
  );
};

export default OwnerSpace;
