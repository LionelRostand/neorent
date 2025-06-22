
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import Header from '@/components/Layout/Header';
import OwnerDashboardStats from '@/components/OwnerSpace/OwnerDashboardStats';
import OwnerRecentActivity from '@/components/OwnerSpace/OwnerRecentActivity';
import OwnerMenuOverview from '@/components/OwnerSpace/OwnerMenuOverview';
import OwnerSpaceQuickActionsSidebar from '@/components/OwnerSpace/OwnerSpaceQuickActionsSidebar';
import PropertyForm from '@/components/PropertyForm';
import ContractForm from '@/components/ContractForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';

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

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Statistiques */}
            <OwnerDashboardStats ownerProfile={currentProfile} />
            
            {/* Aperçu des menus */}
            <OwnerMenuOverview ownerProfile={currentProfile} />
            
            {/* Activité récente */}
            <OwnerRecentActivity ownerProfile={currentProfile} />
          </div>
        );
      case 'property':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Nouvelle propriété</h2>
            <PropertyForm 
              onClose={() => setActiveView('dashboard')}
              onSubmit={async (data) => {
                // Handle property submission
                console.log('Property data:', data);
                setActiveView('dashboard');
              }}
            />
          </div>
        );
      case 'contract':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Nouveau contrat</h2>
            <ContractForm 
              onClose={() => setActiveView('dashboard')}
              onSubmit={async (data) => {
                // Handle contract submission
                console.log('Contract data:', data);
                setActiveView('dashboard');
              }}
            />
          </div>
        );
      case 'roommate':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Ajouter locataire</h2>
            <RoommateForm 
              onClose={() => setActiveView('dashboard')}
              onSubmit={async (data) => {
                // Handle roommate submission
                console.log('Roommate data:', data);
                setActiveView('dashboard');
              }}
            />
          </div>
        );
      case 'inspection':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Inspection immobilière</h2>
            <InspectionForm 
              onClose={() => setActiveView('dashboard')}
              onSubmit={(data) => {
                // Handle inspection submission
                console.log('Inspection data:', data);
                setActiveView('dashboard');
              }}
            />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <OwnerDashboardStats ownerProfile={currentProfile} />
            <OwnerMenuOverview ownerProfile={currentProfile} />
            <OwnerRecentActivity ownerProfile={currentProfile} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar des actions rapides */}
      <OwnerSpaceQuickActionsSidebar 
        ownerProfile={currentProfile} 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="bg-gray-50 min-h-full">
            {/* Header avec profil propriétaire */}
            <div className="bg-white shadow-sm border-b mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {currentProfile?.name?.charAt(0).toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {t('ownerSpace.title')}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {t('ownerSpace.welcome')}, {currentProfile?.name || t('ownerSpace.status.owner')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentProfile?.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 text-xs font-medium">{t('ownerSpace.status.active')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerSpace;
