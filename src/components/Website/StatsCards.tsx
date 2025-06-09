
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Eye, Mail } from 'lucide-react';
import { AnalyticsData } from '@/hooks/useAnalyticsTracking';

interface StatsCardsProps {
  analyticsData: AnalyticsData;
  hasRealData: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ analyticsData, hasRealData }) => {
  const stats = [
    {
      icon: Users,
      value: analyticsData.visitorsToday,
      label: 'Visiteurs aujourd\'hui',
      color: 'text-blue-500'
    },
    {
      icon: Eye,
      value: analyticsData.pageViews,
      label: 'Pages vues',
      color: 'text-green-500'
    },
    {
      icon: Mail,
      value: analyticsData.contactRequests,
      label: 'Demandes contact',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                <div className="text-center sm:text-left">
                  <p className={`text-lg md:text-2xl font-bold ${!hasRealData ? 'text-gray-400' : ''}`}>
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
