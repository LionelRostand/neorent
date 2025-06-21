
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Home, Users, DollarSign, Calendar } from 'lucide-react';

interface OwnerDashboardStatsProps {
  ownerProfile: any;
}

const OwnerDashboardStats: React.FC<OwnerDashboardStatsProps> = ({ ownerProfile }) => {
  const stats = [
    {
      title: 'Propriétés gérées',
      value: '8',
      change: '+2',
      icon: Home,
      color: 'blue'
    },
    {
      title: 'Locataires actifs',
      value: '15',
      change: '+3',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Revenus mensuels',
      value: '12,450€',
      change: '+8.2%',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Taux d\'occupation',
      value: '94%',
      change: '+2%',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {stat.change} ce mois
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                    <Icon className="h-6 w-6" />
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
