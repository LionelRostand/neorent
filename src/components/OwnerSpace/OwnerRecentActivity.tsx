import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, User, Home, DollarSign, Wrench } from 'lucide-react';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface OwnerRecentActivityProps {
  ownerProfile: any;
}

const OwnerRecentActivity: React.FC<OwnerRecentActivityProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { payments } = useFirebasePayments();
  const { roommates } = useFirebaseRoommates();
  const { properties } = useFirebaseProperties();

  // Filtrer les propriétés du propriétaire
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  // Récupérer les activités récentes
  const getRecentActivities = () => {
    const activities = [];

    // Paiements récents
    const recentPayments = payments
      .filter(payment => ownerProperties.some(prop => prop.title === payment.property))
      .sort((a, b) => new Date(b.paymentDate || b.dueDate).getTime() - new Date(a.paymentDate || a.dueDate).getTime())
      .slice(0, 3);

    recentPayments.forEach(payment => {
      const tenant = roommates.find(r => 
        r.property === payment.property && r.status === 'Actif'
      );
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: t('ownerSpace.recentActivity.activities.paymentReceived', { 
          number: payment.property.split(' ').pop() || 'N/A' 
        }),
        description: t('ownerSpace.recentActivity.activities.paymentDescription', { 
          tenant: tenant?.name || 'Locataire', 
          month: new Date(payment.paymentDate || payment.dueDate).toLocaleDateString('fr-FR', { month: 'long' })
        }),
        time: getTimeAgo(payment.paymentDate || payment.dueDate),
        status: payment.status === 'Validé' ? 'success' : 'warning',
        icon: CheckCircle,
        date: new Date(payment.paymentDate || payment.dueDate)
      });
    });

    // Nouveaux locataires
    const recentTenants = roommates
      .filter(roommate => 
        roommate.status === 'Actif' && 
        ownerProperties.some(prop => prop.title === roommate.property)
      )
      .sort((a, b) => new Date(b.moveInDate || 0).getTime() - new Date(a.moveInDate || 0).getTime())
      .slice(0, 2);

    recentTenants.forEach(tenant => {
      activities.push({
        id: `tenant-${tenant.id}`,
        type: 'tenant',
        title: t('ownerSpace.recentActivity.activities.newTenant'),
        description: t('ownerSpace.recentActivity.activities.newTenantDescription', { 
          tenant: tenant.name,
          number: tenant.property.split(' ').pop() || 'N/A'
        }),
        time: getTimeAgo(tenant.moveInDate || new Date().toISOString()),
        status: 'info',
        icon: User,
        date: new Date(tenant.moveInDate || 0)
      });
    });

    // Ajouter quelques activités fictives pour l'exemple
    activities.push(
      {
        id: 'maintenance-1',
        type: 'maintenance',
        title: t('ownerSpace.recentActivity.activities.maintenanceRequest'),
        description: t('ownerSpace.recentActivity.activities.maintenanceDescription', { number: '8' }),
        time: t('ownerSpace.recentActivity.timeAgo.hoursAgo', { count: 4 }),
        status: 'warning',
        icon: Wrench,
        date: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'inspection-1',
        type: 'inspection',
        title: t('ownerSpace.recentActivity.activities.inspectionCompleted'),
        description: t('ownerSpace.recentActivity.activities.inspectionDescription', { number: '3' }),
        time: t('ownerSpace.recentActivity.timeAgo.daysAgo', { count: 2 }),
        status: 'success',
        icon: Home,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    );

    // Trier par date et retourner les 5 plus récentes
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return t('ownerSpace.recentActivity.timeAgo.hoursAgo', { count: diffInHours });
    } else if (diffInHours < 48) {
      return t('ownerSpace.recentActivity.timeAgo.yesterday');
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return t('ownerSpace.recentActivity.timeAgo.daysAgo', { count: diffInDays });
    }
  };

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

  const activities = getRecentActivities();

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
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune activité récente</p>
            </div>
          ) : (
            activities.map((activity) => {
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
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerRecentActivity;
