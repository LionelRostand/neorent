
import React from 'react';
import { useTranslation } from 'react-i18next';
import OwnerDashboardStats from '@/components/OwnerSpace/OwnerDashboardStats';
import OwnerActivityChart from '@/components/OwnerSpace/OwnerActivityChart';
import OwnerRecentActivity from '@/components/OwnerSpace/OwnerRecentActivity';

interface DashboardViewProps {
  currentProfile: any;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentProfile }) => {
  const { i18n } = useTranslation();

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Tableau de Bord',
        en: 'Dashboard'
      },
      subtitle: {
        fr: 'Vue d\'ensemble de votre portefeuille immobilier',
        en: 'Overview of your real estate portfolio'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header harmonisé */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 md:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{getLocalizedText('title')}</h1>
            <p className="text-blue-100 mt-2 text-sm md:text-base">{getLocalizedText('subtitle')}</p>
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
