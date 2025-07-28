
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { Users, Home, TrendingUp } from 'lucide-react';

interface OwnerActivityChartProps {
  ownerProfile: any;
}

const OwnerActivityChart: React.FC<OwnerActivityChartProps> = ({ ownerProfile }) => {
  const { t, i18n } = useTranslation();
  const { tenants, roommates, payments } = useOwnerData(ownerProfile);
  const { properties } = useFirebaseProperties();

  // Get month names based on current language
  const getMonthNames = () => {
    if (i18n.language === 'en') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    }
    return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
  };

  // Données pour le graphique de paiements mensuels
  const paymentData = useMemo(() => {
    const monthNames = getMonthNames();
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
      const monthlyPayments = payments.filter(payment => {
        if (!payment.paymentDate || payment.status !== 'Payé') return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === monthIndex && 
               paymentDate.getFullYear() === year;
      });

      console.log(`🔍 OwnerSpace DÉBOGAGE ${month}:`, {
        totalPayments: payments.length,
        monthlyPayments: monthlyPayments.length,
        totalProperties: properties.length,
        monthlyPaymentDetails: monthlyPayments.map(p => ({
          tenant: p.tenantName,
          property: p.property,
          amount: p.rentAmount,
          status: p.status,
          date: p.paymentDate
        })),
        allProperties: properties.map(p => ({
          title: p.title,
          address: p.address,
          locationType: p.locationType
        }))
      });

      // Séparer les revenus selon le type de propriété (même logique que RevenueChart)
      let locatifRevenue = 0;
      let colocatifRevenue = 0;

      monthlyPayments.forEach(payment => {
        const property = properties.find(p => 
          p.address === payment.property || 
          p.title === payment.property ||
          p.address.includes(payment.property) ||
          payment.property.includes(p.address)
        );
        
        console.log(`🔗 Correspondance pour ${payment.tenantName}:`, {
          paymentProperty: payment.property,
          foundProperty: property ? { title: property.title, address: property.address, type: property.locationType } : null,
          amount: payment.rentAmount
        });
        
        if (property) {
          if (property.locationType === 'Location') {
            locatifRevenue += payment.rentAmount;
            console.log(`💰 Ajouté aux locatifs: ${payment.rentAmount}€`);
          } else if (property.locationType === 'Colocation') {
            colocatifRevenue += payment.rentAmount;
            console.log(`💰 Ajouté aux colocatifs: ${payment.rentAmount}€`);
          }
        } else {
          // Si aucune propriété trouvée, essayer de deviner par le tenantType
          console.log(`⚠️ Aucune propriété trouvée, utilisation tenantType: ${payment.tenantType}`);
          if (payment.tenantType === 'Colocataire' || payment.tenantType === 'colocataire') {
            colocatifRevenue += payment.rentAmount;
          } else {
            locatifRevenue += payment.rentAmount;
          }
        }
      });

      console.log(`📊 RÉSULTAT OwnerSpace pour ${month}:`, {
        locataires: locatifRevenue,
        colocataires: colocatifRevenue
      });

      return {
        month,
        locataires: locatifRevenue,
        colocataires: colocatifRevenue
      };
    });
  }, [payments, properties, i18n.language]);

  // Données pour le graphique en secteurs de répartition
  const distributionData = useMemo(() => {
    const activeTenants = tenants.filter(t => t.status === 'Actif').length;
    const activeRoommates = roommates.filter(r => r.status === 'Actif').length;

    return [
      { name: 'Locataires', value: activeTenants, color: '#3b82f6' },
      { name: 'Colocataires', value: activeRoommates, color: '#10b981' }
    ];
  }, [tenants, roommates]);

  // Données pour l'évolution des occupants - basées sur les données réelles
  const occupancyTrend = useMemo(() => {
    const monthNames = getMonthNames();
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
      // Calculer le nombre de locataires actifs pour ce mois
      const monthlyTenants = tenants.filter(tenant => {
        if (!tenant.leaseStart || tenant.status !== 'Actif') return false;
        const leaseStart = new Date(tenant.leaseStart);
        const targetDate = new Date(year, monthIndex, 1);
        return leaseStart <= targetDate;
      }).length;

      // Calculer le nombre de colocataires actifs pour ce mois
      const monthlyRoommates = roommates.filter(roommate => {
        if (!roommate.moveInDate || roommate.status !== 'Actif') return false;
        const moveInDate = new Date(roommate.moveInDate);
        const targetDate = new Date(year, monthIndex, 1);
        return moveInDate <= targetDate;
      }).length;

      return {
        month,
        total: monthlyTenants + monthlyRoommates,
        locataires: monthlyTenants,
        colocataires: monthlyRoommates
      };
    });
  }, [tenants, roommates, i18n.language]);

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

      {/* Évolution du nombre d'occupants - avec données réelles */}
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
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}`, 
                    name === 'total' ? 'Total' : name === 'locataires' ? 'Locataires' : 'Colocataires'
                  ]}
                  labelFormatter={(label) => `Mois: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="total"
                />
                <Line 
                  type="monotone" 
                  dataKey="locataires" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  name="locataires"
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="colocataires" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  name="colocataires"
                  strokeDasharray="5 5"
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
