
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
      return <Dashboard />;
    case 'admin-properties':
      return <Properties />;
    case 'admin-tenants':
      return <Tenants />;
    case 'admin-roommates':
      return <Roommates />;
    case 'admin-contracts':
      return <Contracts />;
    case 'admin-inspections':
      return <Inspections />;
    case 'admin-rent-management':
      return <RentManagement />;
    case 'admin-rental-charges':
      return <RentalCharges />;
    case 'admin-forecasting':
      return <Forecasting />;
    case 'admin-maintenance':
      return <Maintenance />;
    case 'admin-messages':
      return <Messages />;
    case 'admin-taxes':
      return <Taxes />;
    case 'admin-website':
      return <Website />;
    case 'admin-settings':
      return <Settings />;
    case 'admin-help':
      return <Help />;
    
    default:
      return <DashboardView currentProfile={currentProfile} />;
  }
};

export default ViewRenderer;
