
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Home, Users, DollarSign, Calendar } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

interface OwnerDashboardStatsProps {
  ownerProfile: any;
}

const OwnerDashboardStats: React.FC<OwnerDashboardStatsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { properties } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();
  const { payments } = useFirebasePayments();

  // Filtrer les données selon le propriétaire connecté
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const activeTenants = roommates.filter(roommate => 
    roommate.status === 'Actif' && 
    ownerProperties.some(property => property.title === roommate.property)
  );

  // Calculer les revenus mensuels
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear &&
           ownerProperties.some(property => property.title === payment.property);
  });

  const monthlyRevenue = monthlyPayments.reduce((total, payment) => total + payment.amount, 0);

  // Calculer le taux d'occupation
  const totalRooms = ownerProperties.reduce((total, property) => {
    if (property.locationType === 'Colocation') {
      return total + (property.totalRooms || 0);
    }
    return total + 1;
  }, 0);

  const occupiedRooms = activeTenants.length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const stats = [
    {
      title: t('ownerSpace.dashboard.stats.propertiesManaged'),
      value: ownerProperties.length.toString(),
      change: `+2 ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('ownerSpace.dashboard.stats.activeTenants'),
      value: activeTenants.length.toString(),
      change: `+3 ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('ownerSpace.dashboard.stats.monthlyRevenue'),
      value: `${monthlyRevenue.toLocaleString()}€`,
      change: `+8.2% ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: t('ownerSpace.dashboard.stats.occupancyRate'),
      value: `${occupancyRate}%`,
      change: `+2% ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('ownerSpace.dashboard.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerDashboardStats;
