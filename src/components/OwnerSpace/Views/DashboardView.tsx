
import React from 'react';
import OwnerDashboardStats from '@/components/OwnerSpace/OwnerDashboardStats';
import OwnerActivityChart from '@/components/OwnerSpace/OwnerActivityChart';
import OwnerRecentActivity from '@/components/OwnerSpace/OwnerRecentActivity';

interface DashboardViewProps {
  currentProfile: any;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentProfile }) => {
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <OwnerDashboardStats ownerProfile={currentProfile} />
      
      {/* Graphiques d'activité */}
      <OwnerActivityChart ownerProfile={currentProfile} />
      
      {/* Activité récente */}
      <OwnerRecentActivity ownerProfile={currentProfile} />
    </div>
  );
};

export default DashboardView;
