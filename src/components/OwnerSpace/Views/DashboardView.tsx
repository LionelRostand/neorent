
import React from 'react';
import { useTranslation } from 'react-i18next';
import OwnerDashboardStats from '@/components/OwnerSpace/OwnerDashboardStats';
import OwnerActivityChart from '@/components/OwnerSpace/OwnerActivityChart';
import OwnerRecentActivity from '@/components/OwnerSpace/OwnerRecentActivity';

interface DashboardViewProps {
  currentProfile: any;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-blue-100 mt-2">{t('dashboard.subtitle')}</p>
          </div>
        </div>
      </div>
      
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
