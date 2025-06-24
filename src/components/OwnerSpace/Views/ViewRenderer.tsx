
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
  console.log('ViewRenderer - activeView:', activeView);

  // Handle admin views
  if (activeView.startsWith('admin-')) {
    console.log('ViewRenderer - Rendering admin view:', activeView);
    return (
      <AdminViewRenderer 
        activeView={activeView}
        currentProfile={currentProfile}
      />
    );
  }

  // Handle custom owner views
  const customViews = ['dashboard', 'property', 'contract', 'roommate', 'inspection', 'charges', 'maintenance'];
  if (customViews.includes(activeView)) {
    console.log('ViewRenderer - Rendering custom view:', activeView);
    return (
      <CustomViewRenderer 
        activeView={activeView}
        currentProfile={currentProfile}
        onViewChange={onViewChange}
      />
    );
  }

  // Default fallback to dashboard
  console.log('ViewRenderer - Fallback to dashboard for:', activeView);
  return <DashboardView currentProfile={currentProfile} />;
};

export default ViewRenderer;
