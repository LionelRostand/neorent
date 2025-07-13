
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
      {/* Header Section - Tableau de bord */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Tableau de bord</h1>
            <p className="text-blue-100 mt-2">Vue d'ensemble de votre activité immobilière</p>
          </div>
        </div>
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
