
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import OwnerDashboardStats from '@/components/OwnerSpace/OwnerDashboardStats';
import OwnerQuickActions from '@/components/OwnerSpace/OwnerQuickActions';
import OwnerRecentActivity from '@/components/OwnerSpace/OwnerRecentActivity';
import OwnerPropertyOverview from '@/components/OwnerSpace/OwnerPropertyOverview';

const OwnerSpace = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header avec profil propriétaire */}
        <div className="bg-white shadow-sm border-b mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {currentProfile?.name?.charAt(0).toUpperCase() || 'P'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Espace Propriétaire
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Bienvenue, {currentProfile?.name || 'Propriétaire'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentProfile?.role || 'Propriétaire'} • {currentProfile?.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 text-sm font-medium">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Statistiques */}
              <OwnerDashboardStats ownerProfile={currentProfile} />
              
              {/* Aperçu des propriétés */}
              <OwnerPropertyOverview ownerProfile={currentProfile} />
              
              {/* Activité récente */}
              <OwnerRecentActivity ownerProfile={currentProfile} />
            </div>

            {/* Barre latérale */}
            <div className="space-y-6">
              {/* Actions rapides */}
              <OwnerQuickActions ownerProfile={currentProfile} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OwnerSpace;
