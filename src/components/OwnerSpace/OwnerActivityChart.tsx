
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { Users, Home, TrendingUp } from 'lucide-react';

interface OwnerActivityChartProps {
  ownerProfile: any;
}

const OwnerActivityChart: React.FC<OwnerActivityChartProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { payments } = useFirebasePayments();

  // Données pour le graphique de paiements mensuels
  const paymentData = useMemo(() => {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push({
        month: monthNames[date.getMonth()],
        monthIndex: date.getMonth(),
        year: date.getFullYear()
      });
    }

    return last6Months.map(({ month, monthIndex, year }) => {
      const monthlyTenantPayments = payments
        .filter(payment => {
          if (!payment.paymentDate || payment.status !== 'Payé') return false;
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === monthIndex && 
                 paymentDate.getFullYear() === year &&
                 payment.tenantType === 'Locataire';
        })
        .reduce((sum, payment) => sum + payment.rentAmount, 0);

      const monthlyRoommatePayments = payments
        .filter(payment => {
          if (!payment.paymentDate || payment.status !== 'Payé') return false;
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === monthIndex && 
                 paymentDate.getFullYear() === year &&
                 payment.tenantType === 'Colocataire';
        })
        .reduce((sum, payment) => sum + payment.rentAmount, 0);

      return {
        month,
        locataires: monthlyTenantPayments,
        colocataires: monthlyRoommatePayments
      };
    });
  }, [payments]);

  // Données pour le graphique en secteurs de répartition
  const distributionData = useMemo(() => {
    const activeTenants = tenants.filter(t => t.status === 'Actif').length;
    const activeRoommates = roommates.filter(r => r.status === 'Actif').length;

    return [
      { name: 'Locataires', value: activeTenants, color: '#3b82f6' },
      { name: 'Colocataires', value: activeRoommates, color: '#10b981' }
    ];
  }, [tenants, roommates]);

  // Données pour l'évolution des occupants
  const occupancyTrend = useMemo(() => {
    // Simulation de données d'évolution (en réalité, il faudrait stocker l'historique)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    return months.map((month, index) => ({
      month,
      total: Math.floor(Math.random() * 5) + tenants.length + roommates.length - 2 + index
    }));
  }, [tenants.length, roommates.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Graphique des revenus mensuels */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('dashboard.monthlyRevenue')} - Locataires vs Colocataires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}€`, '']} />
                <Bar dataKey="locataires" fill="#3b82f6" name="Locataires" />
                <Bar dataKey="colocataires" fill="#10b981" name="Colocataires" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphique de répartition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Répartition des Occupants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Évolution du nombre d'occupants */}
      <Card className="lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Évolution du Nombre Total d'Occupants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Occupants']} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerActivityChart;
