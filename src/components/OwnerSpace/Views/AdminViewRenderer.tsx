
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
import AdminDashboardView from './AdminDashboardView';
import AdminPropertiesView from './AdminPropertiesView';
import AdminTenantsView from './AdminTenantsView';
import AdminRoommatesView from './AdminRoommatesView';
import AdminContractsView from './AdminContractsView';
import AdminInspectionsView from './AdminInspectionsView';
import AdminRentManagementView from './AdminRentManagementView';
import AdminRentalChargesView from './AdminRentalChargesView';
import AdminForecastingView from './AdminForecastingView';
import AdminMaintenanceView from './AdminMaintenanceView';
import AdminTaxManagementView from './AdminTaxManagementView';
import AdminSettingsView from './AdminSettingsView';

interface AdminViewRendererProps {
  activeView: string;
  currentProfile: any;
}

const AdminViewRenderer: React.FC<AdminViewRendererProps> = ({ 
  activeView, 
  currentProfile 
}) => {
  console.log('AdminViewRenderer - activeView:', activeView);
  
  // For views that need to be rendered without their main layout wrapper
  const renderWithoutLayout = (Component: React.ComponentType<any>, props: any = {}) => {
    return <Component {...props} />;
  };
  
  // Render owner-specific admin views
  switch (activeView) {
    case 'admin-dashboard':
      return <AdminDashboardView currentProfile={currentProfile} />;
    case 'admin-properties':
      return <AdminPropertiesView currentProfile={currentProfile} />;
    case 'admin-tenants':
      return <AdminTenantsView currentProfile={currentProfile} />;
    case 'admin-roommates':
      return <AdminRoommatesView currentProfile={currentProfile} />;
    case 'admin-contracts':
      return <AdminContractsView currentProfile={currentProfile} />;
    case 'admin-inspections':
      return <AdminInspectionsView currentProfile={currentProfile} />;
    case 'admin-rent-management':
      return <AdminRentManagementView currentProfile={currentProfile} />;
    case 'admin-rental-charges':
      return <AdminRentalChargesView currentProfile={currentProfile} />;
    case 'admin-forecasting':
      return <AdminForecastingView currentProfile={currentProfile} />;
    case 'admin-maintenance':
      return <AdminMaintenanceView currentProfile={currentProfile} />;
    case 'admin-messages':
      return renderWithoutLayout(Messages);
    case 'admin-taxes':
      return <AdminTaxManagementView currentProfile={currentProfile} />;
    case 'admin-website':
      return renderWithoutLayout(Website);
    case 'admin-settings':
      return renderWithoutLayout(Settings);
    case 'admin-help':
      return renderWithoutLayout(Help);
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
