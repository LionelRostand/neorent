
import React from 'react';
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

interface AdminViewRendererProps {
  activeView: string;
  currentProfile: any;
}

const AdminViewRenderer: React.FC<AdminViewRendererProps> = ({ 
  activeView, 
  currentProfile 
}) => {
  // Create owner context for filtering data
  const ownerContext = {
    ownerProfile: currentProfile,
    filterByOwner: true
  };

  switch (activeView) {
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
      return null;
  }
};

export default AdminViewRenderer;
