
import React from 'react';
import DashboardView from './DashboardView';
import PropertyView from './PropertyView';
import ContractView from './ContractView';
import RoommateView from './RoommateView';
import InspectionView from './InspectionView';

interface ViewRendererProps {
  activeView: string;
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const ViewRenderer: React.FC<ViewRendererProps> = ({ activeView, currentProfile, onViewChange }) => {
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
    default:
      return <DashboardView currentProfile={currentProfile} />;
  }
};

export default ViewRenderer;
