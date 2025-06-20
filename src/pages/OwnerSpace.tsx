
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useOwnerSpaceData } from '@/hooks/useOwnerSpaceData';
import OwnerSpaceHeader from '@/components/OwnerSpace/OwnerSpaceHeader';
import OwnerSpaceTabs from '@/components/OwnerSpace/OwnerSpaceTabs';

const OwnerSpace = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    currentOwner,
    ownerProperties,
    ownerTenants,
    ownerRoommates,
    ownerContracts,
    loading,
    error
  } = useOwnerSpaceData();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre espace propriétaire...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-red-600">Erreur de chargement</p>
            <p className="text-gray-500">{error}</p>
            <Button onClick={() => navigate('/admin')} className="mt-4">
              Retour à l'administration
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentOwner) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600">Accès non autorisé</p>
            <p className="text-gray-500">Vous devez être connecté en tant que propriétaire pour accéder à cet espace.</p>
            <Button onClick={() => navigate('/admin')} className="mt-4">
              Retour à l'administration
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
          owner={currentOwner}
          propertiesCount={ownerProperties.length}
          tenantsCount={ownerTenants.length}
          roommatesCount={ownerRoommates.length}
        />

        <OwnerSpaceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          properties={ownerProperties}
          tenants={ownerTenants}
          roommates={ownerRoommates}
          contracts={ownerContracts}
        />
      </div>
    </MainLayout>
  );
};

export default OwnerSpace;
