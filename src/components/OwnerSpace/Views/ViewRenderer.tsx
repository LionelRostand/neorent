
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
  console.log('ViewRenderer - activeView:', activeView);
  console.log('ViewRenderer - currentProfile:', currentProfile);

  // Check if this is an admin view (either starting with 'admin-' or matching admin paths)
  if (activeView.startsWith('admin-') || activeView.startsWith('/admin/')) {
    console.log('Rendering admin view for:', activeView);
    return (
      <AdminViewRenderer 
        activeView={activeView.startsWith('/admin/') ? `admin-${activeView.replace('/admin/', '')}` : activeView}
        currentProfile={currentProfile}
      />
    );
  }

  // Render owner views without any additional layout or headers
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
      default:
        console.log('Default view, rendering AdminDashboardView for:', activeView);
        return <AdminDashboardView currentProfile={currentProfile} />;
    }
  };

  // Return the view directly without any wrapper or layout
  return (
    <div className="w-full h-full">
      {renderView()}
    </div>
  );
};

export default ViewRenderer;
