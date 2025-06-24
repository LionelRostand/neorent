
import React from 'react';
import Dashboard from '@/pages/Dashboard';
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
import AdminPropertiesView from './AdminPropertiesView';
import AdminTenantsView from './AdminTenantsView';
import AdminRoommatesView from './AdminRoommatesView';

interface AdminViewRendererProps {
  activeView: string;
  currentProfile: any;
}

const AdminViewRenderer: React.FC<AdminViewRendererProps> = ({ 
  activeView, 
  currentProfile 
}) => {
  console.log('AdminViewRenderer - activeView:', activeView);
  
  // Render admin pages directly without any wrapper
  switch (activeView) {
    case 'admin-dashboard':
      return <Dashboard />;
    case 'admin-properties':
      return <AdminPropertiesView currentProfile={currentProfile} />;
    case 'admin-tenants':
      return <AdminTenantsView currentProfile={currentProfile} />;
    case 'admin-roommates':
      return <AdminRoommatesView currentProfile={currentProfile} />;
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
      console.log('AdminViewRenderer - No matching view for:', activeView);
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vue non trouvée</h2>
          <p>La vue "{activeView}" n'est pas disponible.</p>
        </div>
      );
  }
};

export default AdminViewRenderer;
