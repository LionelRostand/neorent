
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Home, Users, DollarSign, Calendar } from 'lucide-react';

interface OwnerDashboardStatsProps {
  ownerProfile: any;
}

const OwnerDashboardStats: React.FC<OwnerDashboardStatsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('ownerSpace.dashboard.stats.propertiesManaged'),
      value: '8',
      change: `+2 ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('ownerSpace.dashboard.stats.activeTenants'),
      value: '15',
      change: `+3 ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('ownerSpace.dashboard.stats.monthlyRevenue'),
      value: '12,450€',
      change: `+8.2% ${t('ownerSpace.dashboard.stats.thisMonth')}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: t('ownerSpace.dashboard.stats.occupancyRate'),
      value: '94%',
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
