
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useContractsActions } from '@/hooks/useContractsActions';
import Header from '@/components/Layout/Header';
import OwnerDashboardStats from '@/components/OwnerSpace/OwnerDashboardStats';
import OwnerRecentActivity from '@/components/OwnerSpace/OwnerRecentActivity';
import OwnerActivityChart from '@/components/OwnerSpace/OwnerActivityChart';
import OwnerSpaceQuickActionsSidebar from '@/components/OwnerSpace/OwnerSpaceQuickActionsSidebar';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
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
  const [isNewContractDialogOpen, setIsNewContractDialogOpen] = useState(false);
  const { handleAddContract } = useContractsActions();

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
            
            {/* Graphiques d'activité */}
            <OwnerActivityChart ownerProfile={currentProfile} />
            
            {/* Activité récente */}
            <OwnerRecentActivity ownerProfile={currentProfile} />
          </div>
        );
      case 'property':
        return (
          <div className="space-y-6">
            {/* Métriques pour les propriétés */}
            <OwnerSpaceMetrics ownerProfile={currentProfile} activeView={activeView} />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <PropertyForm 
                onClose={() => setActiveView('dashboard')}
                onSubmit={async (data) => {
                  // Handle property submission
                  console.log('Property data:', data);
                  setActiveView('dashboard');
                }}
                isInDialog={false}
              />
            </div>
          </div>
        );
      case 'contract':
        return (
          <div className="space-y-6">
            {/* Métriques pour les contrats */}
            <OwnerSpaceMetrics ownerProfile={currentProfile} activeView={activeView} />
            
            {/* Bouton New Contract */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des Contrats</h3>
              <Dialog open={isNewContractDialogOpen} onOpenChange={setIsNewContractDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Contrat
                  </Button>
                </DialogTrigger>
                <ContractForm
                  onClose={() => setIsNewContractDialogOpen(false)}
                  onSubmit={async (data) => {
                    await handleAddContract(data);
                    setIsNewContractDialogOpen(false);
                  }}
                />
              </Dialog>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ContractForm 
                onClose={() => setActiveView('dashboard')}
                onSubmit={async (data) => {
                  // Handle contract submission
                  console.log('Contract data:', data);
                  setActiveView('dashboard');
                }}
                isInDialog={false}
              />
            </div>
          </div>
        );
      case 'roommate':
        return (
          <div className="space-y-6">
            {/* Métriques pour les colocataires */}
            <OwnerSpaceMetrics ownerProfile={currentProfile} activeView={activeView} />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RoommateForm 
                onClose={() => setActiveView('dashboard')}
                onSubmit={async (data) => {
                  // Handle roommate submission
                  console.log('Roommate data:', data);
                  setActiveView('dashboard');
                }}
                isInDialog={false}
              />
            </div>
          </div>
        );
      case 'inspection':
        return (
          <div className="space-y-6">
            {/* Métriques pour les inspections */}
            <OwnerSpaceMetrics ownerProfile={currentProfile} activeView={activeView} />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <InspectionForm 
                onClose={() => setActiveView('dashboard')}
                onSubmit={(data) => {
                  // Handle inspection submission
                  console.log('Inspection data:', data);
                  setActiveView('dashboard');
                }}
                isInDialog={false}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <OwnerDashboardStats ownerProfile={currentProfile} />
            <OwnerActivityChart ownerProfile={currentProfile} />
            <OwnerRecentActivity ownerProfile={currentProfile} />
          </div>
        );
    }
  };

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
            <div className="bg-white shadow-sm border-b mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-base lg:text-lg font-bold">
                        {currentProfile?.name?.charAt(0).toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
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

            {/* Contenu principal avec padding responsive */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pb-6 lg:pb-8">
              {renderContent()}
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
