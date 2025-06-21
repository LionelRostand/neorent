
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, User, Home } from 'lucide-react';

interface OwnerRecentActivityProps {
  ownerProfile: any;
}

const OwnerRecentActivity: React.FC<OwnerRecentActivityProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();

  const activities = [
    {
      id: 1,
      type: 'payment',
      title: t('ownerSpace.recentActivity.activities.paymentReceived', { number: '12' }),
      description: t('ownerSpace.recentActivity.activities.paymentDescription', { tenant: 'Marie Dupont', month: 'janvier' }),
      time: t('ownerSpace.recentActivity.timeAgo.hoursAgo', { count: 2 }),
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'maintenance',
      title: t('ownerSpace.recentActivity.activities.maintenanceRequest'),
      description: t('ownerSpace.recentActivity.activities.maintenanceDescription', { number: '8' }),
      time: t('ownerSpace.recentActivity.timeAgo.hoursAgo', { count: 4 }),
      status: 'warning',
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'tenant',
      title: t('ownerSpace.recentActivity.activities.newTenant'),
      description: t('ownerSpace.recentActivity.activities.newTenantDescription', { tenant: 'Jean Martin', number: '15' }),
      time: t('ownerSpace.recentActivity.timeAgo.yesterday'),
      status: 'info',
      icon: User
    },
    {
      id: 4,
      type: 'inspection',
      title: t('ownerSpace.recentActivity.activities.inspectionCompleted'),
      description: t('ownerSpace.recentActivity.activities.inspectionDescription', { number: '3' }),
      time: t('ownerSpace.recentActivity.timeAgo.daysAgo', { count: 2 }),
      status: 'success',
      icon: Home
    },
    {
      id: 5,
      type: 'payment',
      title: t('ownerSpace.recentActivity.activities.paymentDelay'),
      description: t('ownerSpace.recentActivity.activities.paymentDelayDescription', { tenant: 'Paul Dubois', number: '7', days: 5 }),
      time: t('ownerSpace.recentActivity.timeAgo.daysAgo', { count: 3 }),
      status: 'error',
      icon: AlertCircle
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('ownerSpace.recentActivity.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${getIconColor(activity.status)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {t(`ownerSpace.recentActivity.types.${activity.type}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerRecentActivity;
