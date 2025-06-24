
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
  // Render admin pages without any sidebar, only the main content
  switch (activeView) {
    case 'admin-dashboard':
      return (
        <div className="w-full h-full">
          <Dashboard />
        </div>
      );
    case 'admin-properties':
      return (
        <div className="w-full h-full">
          <Properties />
        </div>
      );
    case 'admin-tenants':
      return (
        <div className="w-full h-full">
          <Tenants />
        </div>
      );
    case 'admin-roommates':
      return (
        <div className="w-full h-full">
          <Roommates />
        </div>
      );
    case 'admin-contracts':
      return (
        <div className="w-full h-full">
          <Contracts />
        </div>
      );
    case 'admin-inspections':
      return (
        <div className="w-full h-full">
          <Inspections />
        </div>
      );
    case 'admin-rent-management':
      return (
        <div className="w-full h-full">
          <RentManagement />
        </div>
      );
    case 'admin-rental-charges':
      return (
        <div className="w-full h-full">
          <RentalCharges />
        </div>
      );
    case 'admin-forecasting':
      return (
        <div className="w-full h-full">
          <Forecasting />
        </div>
      );
    case 'admin-maintenance':
      return (
        <div className="w-full h-full">
          <Maintenance />
        </div>
      );
    case 'admin-messages':
      return (
        <div className="w-full h-full">
          <Messages />
        </div>
      );
    case 'admin-taxes':
      return (
        <div className="w-full h-full">
          <Taxes />
        </div>
      );
    case 'admin-website':
      return (
        <div className="w-full h-full">
          <Website />
        </div>
      );
    case 'admin-settings':
      return (
        <div className="w-full h-full">
          <Settings />
        </div>
      );
    case 'admin-help':
      return (
        <div className="w-full h-full">
          <Help />
        </div>
      );
    default:
      return null;
  }
};

export default AdminViewRenderer;
