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
import Messages from '@/pages/Messages';
import WebsiteView from './WebsiteView';
import HelpView from './HelpView';
import OwnerChat from '@/components/OwnerSpace/OwnerChat';

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
        return <Messages />;
      case 'chat':
        return <OwnerChat ownerProfile={currentProfile} />;
      case 'website':
        return <WebsiteView />;
      case 'help':
        return <HelpView currentProfile={currentProfile} onViewChange={onViewChange} />;
      default:
        return <AdminDashboardView currentProfile={currentProfile} />;
    }
  };

  // Return the view directly without any wrapper or layout
  return renderView();
};

export default ViewRenderer;
