
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

  // Pages that should use full-width layout without NeoRent sidebar
  const fullWidthPages = ['messages', 'website', 'help'];
  const isFullWidthPage = fullWidthPages.includes(activeView);

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
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Centre de Messages</h1>
              <p className="text-gray-600 mb-6">Communiquez avec les locataires et gérez les demandes</p>
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">Module de messagerie en cours de développement</p>
              </div>
            </div>
          </div>
        );
      case 'website':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Gestion du Site Web</h1>
              <p className="text-gray-600 mb-6">Gérez votre site web immobilier et votre présence en ligne</p>
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">Module de gestion du site web en cours de développement</p>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Centre d'Aide</h1>
              <p className="text-gray-600 mb-6">Documentation et support pour utiliser la plateforme</p>
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">Centre d'aide en cours de développement</p>
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
