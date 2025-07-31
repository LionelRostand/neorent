
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
import { useOwnerData } from '@/hooks/useOwnerData';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';

const Dashboard = () => {
  const { t } = useTranslation();
  const { userType } = useAuth();
  const { getCurrentProfile } = useAdminTenantAccess();
  const currentProfile = getCurrentProfile();
  
  // Si c'est un propriétaire, utiliser les données filtrées
  const ownerData = useOwnerData(currentProfile);
  const globalMetrics = useDashboardMetrics();
  
  // Déterminer quelles données utiliser selon le type d'utilisateur
  const isOwner = userType === 'owner' || currentProfile?.role === 'owner';
  
  console.log('=== Dashboard Debug ===');
  console.log('User type:', userType);
  console.log('Current profile:', currentProfile);
  console.log('Is owner:', isOwner);
  console.log('Using owner data:', isOwner);
  console.log('=======================');
  
  // Calculer les métriques selon le type d'utilisateur
  const metrics = isOwner ? {
    // Métriques calculées pour le propriétaire
    monthlyRevenue: (() => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyPayments = ownerData.payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.dueDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear &&
               payment.status === 'Payé';
      });
      return monthlyPayments.reduce((total, payment) => total + payment.rentAmount, 0);
    })(),
    totalProperties: ownerData.properties.length,
    totalActiveTenants: [
      ...ownerData.tenants.filter(t => t.status === 'Actif'),
      ...ownerData.roommates.filter(r => r.status === 'Actif')
    ].length,
    occupancyRate: (() => {
      const occupiedProperties = ownerData.properties.filter(property => {
        const propertyTenants = ownerData.tenants.filter(t => t.property === property.title && t.status === 'Actif');
        const propertyRoommates = ownerData.roommates.filter(r => r.property === property.title && r.status === 'Actif');
        return propertyTenants.length > 0 || propertyRoommates.length > 0;
      }).length;
      return ownerData.properties.length > 0 ? (occupiedProperties / ownerData.properties.length) * 100 : 0;
    })(),
    averageYield: (() => {
      // Calculer le rendement réel basé sur les données du propriétaire
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyPayments = ownerData.payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.dueDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear &&
               payment.status === 'Payé';
      });
      const monthlyRevenue = monthlyPayments.reduce((total, payment) => total + payment.rentAmount, 0);
      const annualRevenue = monthlyRevenue * 12;
      
      // Estimer la valeur des propriétés du propriétaire
      const totalPropertyValue = ownerData.properties.reduce((sum, property) => {
        // Utiliser creditImmobilier ou estimation basée sur le loyer
        const propertyValue = property.creditImmobilier 
          ? parseFloat(property.creditImmobilier.toString()) 
          : parseFloat(property.rent || '0') * 12 * 15; // 15x le loyer annuel comme estimation
        return sum + (propertyValue || 0);
      }, 0);
      
      return totalPropertyValue > 0 ? Math.round(((annualRevenue / totalPropertyValue) * 100) * 100) / 100 : 0;
    })()
  } : globalMetrics; // Pour l'admin, utiliser les métriques globales
  
  const { payments } = useFirebasePayments();
  const { contracts } = useFirebaseContracts();
  const { inspections } = useFirebaseInspections();

  // Alertes importantes - filtrer selon le type d'utilisateur
  const relevantPayments = isOwner ? ownerData.payments : payments;
  const relevantContracts = isOwner ? ownerData.contracts : contracts;
  const relevantInspections = isOwner ? ownerData.inspections : inspections;
  
  const latePayments = relevantPayments.filter(p => p.status === 'En retard');
  const expiringContracts = relevantContracts.filter(c => {
    if (!c.endDate) return false;
    const endDate = new Date(c.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });
  const urgentInspections = relevantInspections.filter(i => i.status === 'Urgent');

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
          <RevenueChart 
            payments={isOwner ? ownerData.payments : undefined}
            properties={isOwner ? ownerData.properties : undefined}
          />
          <RecentActivity 
            payments={isOwner ? ownerData.payments : undefined}
            tenants={isOwner ? ownerData.tenants : undefined}
            inspections={isOwner ? ownerData.inspections : undefined}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
