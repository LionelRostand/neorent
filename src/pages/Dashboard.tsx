
import React from 'react';
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
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre portefeuille immobilier</p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Revenus ce mois"
            value={`${metrics.monthlyRevenue.toLocaleString()}€`}
            change="+12% vs mois dernier"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-green-500"
          />
          <MetricCard
            title="Biens gérés"
            value={metrics.totalProperties.toString()}
            change="+2 nouveaux ce mois"
            changeType="positive"
            icon={Building2}
            iconColor="bg-blue-500"
          />
          <MetricCard
            title="Locataires actifs"
            value={metrics.totalActiveTenants.toString()}
            change={`${metrics.occupancyRate.toFixed(1)}% taux d'occupation`}
            changeType="positive"
            icon={Users}
            iconColor="bg-purple-500"
          />
          <MetricCard
            title="Rendement moyen"
            value={`${metrics.averageYield}%`}
            change="+0.3% vs trimestre"
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
                Alertes importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latePayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <span className="text-sm">Loyer en retard - {payment.property}</span>
                    <Badge variant="destructive">En retard</Badge>
                  </div>
                ))}
                {expiringContracts.slice(0, 2).map((contract) => {
                  const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={contract.id} className="flex items-center justify-between">
                      <span className="text-sm">Bail expirant - {contract.property}</span>
                      <Badge variant="secondary">{daysUntilExpiry} jours</Badge>
                    </div>
                  );
                })}
                {urgentInspections.slice(0, 1).map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between">
                    <span className="text-sm">Inspection urgente - {inspection.property}</span>
                    <Badge variant="destructive">Urgent</Badge>
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
