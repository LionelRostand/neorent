
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import MetricCard from '@/components/Dashboard/MetricCard';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import RevenueChart from '@/components/Dashboard/RevenueChart';
import { Building2, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';

const Dashboard = () => {
  const { t } = useTranslation();
  const metrics = useDashboardMetrics();
  const { payments } = useFirebasePayments();
  const { contracts } = useFirebaseContracts();
  const { inspections } = useFirebaseInspections();

  // Alertes importantes
  const latePayments = payments.filter(p => p.status === 'En retard');
  const expiringContracts = contracts.filter(c => {
    if (!c.endDate) return false;
    const endDate = new Date(c.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });
  const urgentInspections = inspections.filter(i => i.status === 'Urgent');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={t('dashboard.monthlyRevenue')}
            value={`${metrics.monthlyRevenue.toLocaleString()}€`}
            change={`+12% ${t('dashboard.vsLastMonth')}`}
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-green-500"
          />
          <MetricCard
            title={t('dashboard.managedProperties')}
            value={metrics.totalProperties.toString()}
            change={`+2 ${t('dashboard.newThisMonth')}`}
            changeType="positive"
            icon={Building2}
            iconColor="bg-blue-500"
          />
          <MetricCard
            title={t('dashboard.activeTenants')}
            value={metrics.totalActiveTenants.toString()}
            change={`${metrics.occupancyRate.toFixed(1)}% ${t('dashboard.occupancyRate')}`}
            changeType="positive"
            icon={Users}
            iconColor="bg-purple-500"
          />
          <MetricCard
            title={t('dashboard.averageYield')}
            value={`${metrics.averageYield}%`}
            change={`+0.3% ${t('dashboard.vsQuarter')}`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-orange-500"
          />
        </div>

        {/* Alertes et notifications */}
        {(latePayments.length > 0 || expiringContracts.length > 0 || urgentInspections.length > 0) && (
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                {t('dashboard.importantAlerts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latePayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <span className="text-sm">{t('dashboard.lateRent')} - {payment.property}</span>
                    <Badge variant="destructive">{t('dashboard.late')}</Badge>
                  </div>
                ))}
                {expiringContracts.slice(0, 2).map((contract) => {
                  const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={contract.id} className="flex items-center justify-between">
                      <span className="text-sm">{t('dashboard.expiringLease')} - {contract.property}</span>
                      <Badge variant="secondary">{daysUntilExpiry} {t('dashboard.days')}</Badge>
                    </div>
                  );
                })}
                {urgentInspections.slice(0, 1).map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between">
                    <span className="text-sm">{t('dashboard.urgentInspection')} - {inspection.property}</span>
                    <Badge variant="destructive">{t('dashboard.urgent')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Graphiques et activité */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
