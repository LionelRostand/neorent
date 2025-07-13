
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Home, Users, DollarSign, Calendar } from 'lucide-react';
import { useOwnerData } from '@/hooks/useOwnerData';

interface OwnerDashboardStatsProps {
  ownerProfile: any;
}

const OwnerDashboardStats: React.FC<OwnerDashboardStatsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const ownerData = useOwnerData(ownerProfile);

  // Calculer les revenus mensuels
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPayments = ownerData.payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate || payment.dueDate);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  const monthlyRevenue = monthlyPayments.reduce((total, payment) => total + payment.rentAmount, 0);

  // Calculer le taux d'occupation
  const activeTenants = [...ownerData.roommates, ...ownerData.tenants].filter(t => t.status === 'Actif');
  const totalRooms = ownerData.properties.reduce((total, property) => {
    if (property.locationType === 'Colocation') {
      return total + (property.totalRooms || 0);
    }
    return total + 1;
  }, 0);

  const occupiedRooms = activeTenants.length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const stats = [
    {
      title: "dashboard.properties",
      value: ownerData.properties.length.toString(),
      change: "+2 nouveaux ce mois",
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: "Propriétés"
    },
    {
      title: "dashboard.tenants", 
      value: activeTenants.length.toString(),
      change: "+3 nouveaux ce mois",
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: "Locataires"
    },
    {
      title: "dashboard.contracts",
      value: ownerData.contracts.length.toString(),
      change: "+1 nouveaux ce mois",
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: "Contrats"
    },
    {
      title: "Revenus Mensuels",
      value: `${monthlyRevenue.toLocaleString()}€`,
      change: "+8.2% nouveaux ce mois",
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: "Revenus"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.description}</p>
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
  );
};

export default OwnerDashboardStats;
