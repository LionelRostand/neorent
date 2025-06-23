
import React from 'react';
import DashboardView from './DashboardView';
import PropertyView from './PropertyView';
import ContractView from './ContractView';
import RoommateView from './RoommateView';
import InspectionView from './InspectionView';
import RentalChargesView from './RentalChargesView';
import MaintenanceView from './MaintenanceView';

interface CustomViewRendererProps {
  activeView: string;
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const CustomViewRenderer: React.FC<CustomViewRendererProps> = ({ 
  activeView, 
  currentProfile, 
  onViewChange 
}) => {
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
    default:
      return null;
  }
};

export default CustomViewRenderer;
