
import React from 'react';
import CustomViewRenderer from './CustomViewRenderer';
import AdminViewRenderer from './AdminViewRenderer';
import DashboardView from './DashboardView';

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
  // Handle custom owner views
  const customView = ['dashboard', 'property', 'contract', 'roommate', 'inspection', 'charges', 'maintenance'];
  if (customView.includes(activeView)) {
    return (
      <CustomViewRenderer 
        activeView={activeView}
        currentProfile={currentProfile}
        onViewChange={onViewChange}
      />
    );
  }

  // Handle admin views
  if (activeView.startsWith('admin-')) {
    return (
      <AdminViewRenderer 
        activeView={activeView}
        currentProfile={currentProfile}
      />
    );
  }

  // Default fallback
  return <DashboardView currentProfile={currentProfile} />;
};

export default ViewRenderer;
