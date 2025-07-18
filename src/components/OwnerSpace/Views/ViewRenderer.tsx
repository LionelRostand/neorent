import React from 'react';
import DashboardView from './DashboardView';
import PropertyView from './PropertyView';
import ContractView from './ContractView';
import InspectionView from './InspectionView';
import MaintenanceView from './MaintenanceView';
import RoommateView from './RoommateView';
import RentalChargesView from './RentalChargesView';
import AdminViewRenderer from './AdminViewRenderer';
import AdminDashboardView from './AdminDashboardView';

interface ViewRendererProps {
  activeView: string;
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const ViewRenderer: React.FC<ViewRendererProps> = ({
  activeView,
  currentProfile,
  onViewChange
}) => {
  // Check if this is an admin view
  if (activeView.startsWith('admin-')) {
    return (
      <AdminViewRenderer 
        activeView={activeView}
        currentProfile={currentProfile}
      />
    );
  }

  // Render view with conditional layout
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboardView currentProfile={currentProfile} />;
      case 'properties':
        return <PropertyView currentProfile={currentProfile} onViewChange={onViewChange} />;
      case 'contracts':
        return <ContractView currentProfile={currentProfile} onViewChange={onViewChange} />;
      case 'inspections':
        return <InspectionView currentProfile={currentProfile} onViewChange={onViewChange} />;
      case 'maintenance':
        return <MaintenanceView currentProfile={currentProfile} onViewChange={onViewChange} />;
      case 'roommates':
        return <RoommateView currentProfile={currentProfile} onViewChange={onViewChange} />;
      case 'rental-charges':
        return <RentalChargesView currentProfile={currentProfile} onViewChange={onViewChange} />;
      case 'messages':
        return (
          <div className="min-h-screen bg-gray-50 w-full">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Centre de Messages</h1>
                    <p className="text-gray-600 mt-2">Communiquez avec les locataires et gérez les demandes</p>
                  </div>
                  <button 
                    onClick={() => onViewChange('dashboard')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retour au tableau de bord
                  </button>
                </div>
                
                {/* Message Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.013 9.013 0 01-5.314-1.686l-3.681.921.86-3.655A8.963 8.963 0 013 12c0-4.418 3.582-8 8-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversations Totales</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-full mr-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Messages Non Lus</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-full mr-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Clients En Ligne</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacts Section */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Contacts</h2>
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Aucun contact</p>
                    <p className="text-sm text-gray-400 mt-2">Module de messagerie en cours de développement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'website':
        return (
          <div className="min-h-screen bg-gray-50 w-full">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion du Site Web</h1>
                    <p className="text-gray-600 mt-2">Gérez votre site web immobilier et votre présence en ligne</p>
                  </div>
                  <button 
                    onClick={() => onViewChange('dashboard')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retour au tableau de bord
                  </button>
                </div>
                
                {/* Website Management Options */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-100 rounded-full mx-auto w-fit mb-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Gérer les Pages</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-100 rounded-full mx-auto w-fit mb-3">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Immo</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-100 rounded-full mx-auto w-fit mb-3">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Modifier le Contenu du Site Web</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                    <div className="p-3 bg-orange-100 rounded-full mx-auto w-fit mb-3">
                      <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Galerie Photos</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                    <div className="p-3 bg-gray-100 rounded-full mx-auto w-fit mb-3">
                      <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Thème</p>
                  </div>
                </div>

                {/* Pages Management */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h2 className="text-lg font-semibold">Gérer les Pages</h2>
                    </div>
                    <p className="text-gray-600 mt-1">Gérez votre site web de liste de propriétés et marketing en ligne</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <div>
                      <h3 className="font-medium mb-4">Pages</h3>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Accueil</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Nouveau Page</h3>
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <p className="text-gray-500 mb-2">Page Nom</p>
                        <p className="text-sm text-gray-400">Module de gestion du site web en cours de développement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="min-h-screen bg-gray-50 w-full">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Centre d'Aide</h1>
                    <p className="text-gray-600 mt-2">Documentation et support pour utiliser la plateforme</p>
                  </div>
                  <button 
                    onClick={() => onViewChange('dashboard')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retour au tableau de bord
                  </button>
                </div>
                
                {/* Help Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prise en main
                    </button>
                    <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Configuration
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Rechercher dans l'aide..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Toutes les catégories', 'Vue d\'ensemble', 'Immobilier', 'Location', 'Documentation', 'Finance', 'Communication', 'Administration', 'Marketing', 'Configuration'].map((category) => (
                    <button 
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm ${
                        category === 'Toutes les catégories' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Help Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Tableau de bord</h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Vue d'ensemble</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Vue d'ensemble de votre activité</p>
                    <p className="text-xs text-gray-500">Centre d'aide en cours de développement</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Gestion des propriétés</h3>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Immobilier</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Ajoutez, modifiez et gérez vos biens immobiliers avec photos et descriptions</p>
                    <p className="text-xs text-gray-500">Centre d'aide en cours de développement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <AdminDashboardView currentProfile={currentProfile} />;
    }
  };

  // Return the view directly without any wrapper or layout
  return renderView();
};

export default ViewRenderer;
