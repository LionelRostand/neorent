
import React from 'react';
import { useTranslation } from 'react-i18next';
import OwnerDashboardStats from '../OwnerDashboardStats';
import OwnerQuickActions from '../OwnerQuickActions';
import OwnerRecentActivity from '../OwnerRecentActivity';

interface AdminDashboardViewProps {
  currentProfile: any;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  console.log('AdminDashboardView rendering with profile:', currentProfile);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {t('ownerSpace.welcome')}
        </h1>
        <p className="text-gray-600">
          {t('ownerSpace.subtitle')}
        </p>
      </div>

      {/* Dashboard Stats */}
      <OwnerDashboardStats ownerProfile={currentProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <OwnerQuickActions 
            ownerProfile={currentProfile}
            showControls={false}
          />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <OwnerRecentActivity ownerProfile={currentProfile} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
