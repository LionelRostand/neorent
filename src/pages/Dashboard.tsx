
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import MetricCard from '@/components/Dashboard/MetricCard';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import RevenueChart from '@/components/Dashboard/RevenueChart';
import { Building2, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
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
            value="5,400€"
            change="+12% vs mois dernier"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-green-500"
          />
          <MetricCard
            title="Biens gérés"
            value="24"
            change="+2 nouveaux ce mois"
            changeType="positive"
            icon={Building2}
            iconColor="bg-blue-500"
          />
          <MetricCard
            title="Locataires actifs"
            value="22"
            change="91.7% taux d'occupation"
            changeType="positive"
            icon={Users}
            iconColor="bg-purple-500"
          />
          <MetricCard
            title="Rendement moyen"
            value="6.2%"
            change="+0.3% vs trimestre"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-orange-500"
          />
        </div>

        {/* Alertes et notifications */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertes importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Loyer en retard - Studio Centre-ville</span>
                <Badge variant="destructive">3 jours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bail expirant - Appartement Rue Voltaire</span>
                <Badge variant="secondary">30 jours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Réparation urgente - Villa Montparnasse</span>
                <Badge variant="destructive">Urgent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
