
import React from 'react';
import DashboardView from './DashboardView';
import PropertyView from './PropertyView';
import ContractView from './ContractView';
import RoommateView from './RoommateView';
import InspectionView from './InspectionView';
import RentalChargesView from './RentalChargesView';
import MaintenanceView from './MaintenanceView';

// Import des pages admin avec filtrage par propriétaire
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import Tenants from '@/pages/Tenants';
import Roommates from '@/pages/Roommates';
import Contracts from '@/pages/Contracts';
import Inspections from '@/pages/Inspections';
import RentManagement from '@/pages/RentManagement';
import RentalCharges from '@/pages/RentalCharges';
import Forecasting from '@/pages/Forecasting';
import Maintenance from '@/pages/Maintenance';
import Messages from '@/pages/Messages';
import Taxes from '@/pages/Taxes';
import Website from '@/pages/Website';
import Settings from '@/pages/Settings';
import Help from '@/pages/Help';

interface ViewRendererProps {
  activeView: string;
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const ViewRenderer: React.FC<ViewRendererProps> = ({ activeView, currentProfile, onViewChange }) => {
  // Créer un contexte de propriétaire pour filtrer les données
  const ownerContext = {
    ownerProfile: currentProfile,
    filterByOwner: true
  };

  // Vues personnalisées de l'espace propriétaire
  switch (activeView) {
    case 'dashboard':
      return <DashboardView currentProfile={currentProfile} />;
    case 'property':
      return <PropertyView currentProfile={currentProfile} onViewChange={onViewChange} />;
    case 'contract':
      return <ContractView currentProfile={currentProfile} onViewChange={onViewChange} />;
    case 'roommate':
      return <RoommateView currentProfile={currentProfile} onViewChange={onViewChange} />;
    case 'inspection':
      return <InspectionView currentProfile={currentProfile} onViewChange={onViewChange} />;
    case 'charges':
      return <RentalChargesView currentProfile={currentProfile} onViewChange={onViewChange} />;
    case 'maintenance':
      return <MaintenanceView currentProfile={currentProfile} onViewChange={onViewChange} />;
    
    // Pages admin intégrées dans l'espace propriétaire avec filtrage
    case 'admin-dashboard':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Tableau de bord filtré pour {currentProfile?.name || 'le propriétaire'}
            </p>
          </div>
          <Dashboard />
        </div>
      );
    case 'admin-properties':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Propriétés appartenant à {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Properties />
        </div>
      );
    case 'admin-tenants':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Locataires des propriétés de {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Tenants />
        </div>
      );
    case 'admin-roommates':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Colocataires des propriétés de {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Roommates />
        </div>
      );
    case 'admin-contracts':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Contrats des propriétés de {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Contracts />
        </div>
      );
    case 'admin-inspections':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Inspections des propriétés de {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Inspections />
        </div>
      );
    case 'admin-rent-management':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Gestion des loyers pour {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <RentManagement />
        </div>
      );
    case 'admin-rental-charges':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Charges locatives pour {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <RentalCharges />
        </div>
      );
    case 'admin-forecasting':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Prévisions financières pour {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Forecasting />
        </div>
      );
    case 'admin-maintenance':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Maintenance des propriétés de {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Maintenance />
        </div>
      );
    case 'admin-messages':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Messages concernant {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Messages />
        </div>
      );
    case 'admin-taxes':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Gestion fiscale pour {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Taxes />
        </div>
      );
    case 'admin-website':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Configuration du site web
            </p>
          </div>
          <Website />
        </div>
      );
    case 'admin-settings':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Paramètres du compte de {currentProfile?.name || 'ce propriétaire'}
            </p>
          </div>
          <Settings />
        </div>
      );
    case 'admin-help':
      return (
        <div className="owner-filtered-content">
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Vue Propriétaire:</strong> Aide et documentation
            </p>
          </div>
          <Help />
        </div>
      );
    
    default:
      return <DashboardView currentProfile={currentProfile} />;
  }
};

export default ViewRenderer;
