
import React from 'react';
import DashboardView from './DashboardView';
import PropertyView from './PropertyView';
import ContractView from './ContractView';
import InspectionView from './InspectionView';
import MaintenanceView from './MaintenanceView';
import RoommateView from './RoommateView';
import RentalChargesView from './RentalChargesView';
import AdminViewRenderer from './AdminViewRenderer';

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

  // Render owner views without any additional layout or headers
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView currentProfile={currentProfile} />;
      case 'properties':
        return <PropertyView currentProfile={currentProfile} />;
      case 'contracts':
        return <ContractView currentProfile={currentProfile} />;
      case 'inspections':
        return <InspectionView currentProfile={currentProfile} />;
      case 'maintenance':
        return <MaintenanceView currentProfile={currentProfile} />;
      case 'roommates':
        return <RoommateView currentProfile={currentProfile} />;
      case 'rental-charges':
        return <RentalChargesView currentProfile={currentProfile} />;
      default:
        return <DashboardView currentProfile={currentProfile} />;
    }
  };

  // Return the view directly without any wrapper or layout
  return renderView();
};

export default ViewRenderer;
