
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import MetricCard from '@/components/Dashboard/MetricCard';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import RevenueChart from '@/components/Dashboard/RevenueChart';
import NavigationGrid from '@/components/Dashboard/NavigationGrid';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Building, Users, FileText, Euro } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { metrics, loading } = useDashboardMetrics();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={t('dashboard.metrics.totalProperties')}
            value={metrics.totalProperties}
            icon={Building}
            color="blue"
          />
          <MetricCard
            title={t('dashboard.metrics.totalTenants')}
            value={metrics.totalTenants}
            icon={Users}
            color="green"
          />
          <MetricCard
            title={t('dashboard.metrics.activeContracts')}
            value={metrics.activeContracts}
            icon={FileText}
            color="purple"
          />
          <MetricCard
            title={t('dashboard.metrics.monthlyRevenue')}
            value={`${metrics.monthlyRevenue}€`}
            icon={Euro}
            color="orange"
          />
        </div>

        {/* Navigation Grid */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Accès rapide</h2>
          <NavigationGrid />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
