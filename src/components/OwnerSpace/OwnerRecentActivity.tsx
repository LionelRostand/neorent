
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, User, Home, DollarSign, Wrench } from 'lucide-react';
import { useOwnerData } from '@/hooks/useOwnerData';

interface OwnerRecentActivityProps {
  ownerProfile: any;
}

const OwnerRecentActivity: React.FC<OwnerRecentActivityProps> = ({ ownerProfile }) => {
  const { t, i18n } = useTranslation();
  const { properties, roommates, tenants, payments, contracts, inspections } = useOwnerData(ownerProfile);

  // Récupérer les activités récentes basées sur les données réelles
  const getRecentActivities = () => {
    const activities = [];

    // Paiements récents (derniers 5)
    const recentPayments = payments
      .filter(payment => payment.paymentDate && payment.status === 'Payé')
      .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
      .slice(0, 3);

    recentPayments.forEach(payment => {
      const tenant = [...tenants, ...roommates].find(t => 
        t.property === payment.property && t.status === 'Actif'
      );
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: t('ownerSpace.recentActivity.activities.paymentReceived', { 
          number: payment.property.split(' ').pop() || 'N/A' 
        }),
        description: t('ownerSpace.recentActivity.activities.paymentDescription', { 
          tenant: tenant?.name || payment.tenantName || 'Locataire', 
          month: new Date(payment.paymentDate!).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { month: 'long' })
        }),
        time: getTimeAgo(payment.paymentDate!),
        status: 'success',
        icon: CheckCircle,
        date: new Date(payment.paymentDate!)
      });
    });

    // Nouveaux locataires récents
    const recentTenants = tenants
      .filter(tenant => 
        tenant.status === 'Actif' && tenant.leaseStart
      )
      .sort((a, b) => {
        const dateA = new Date(a.leaseStart || 0);
        const dateB = new Date(b.leaseStart || 0);
        return dateB.getTime() - dateA.getTime();
      })
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
        time: getTimeAgo(tenant.leaseStart!),
        status: 'info',
        icon: User,
        date: new Date(tenant.leaseStart!)
      });
    });

    // Nouveaux colocataires récents
    const recentRoommates = roommates
      .filter(roommate => 
        roommate.status === 'Actif' && roommate.moveInDate
      )
      .sort((a, b) => {
        const dateA = new Date(a.moveInDate || 0);
        const dateB = new Date(b.moveInDate || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 2);

    recentRoommates.forEach(roommate => {
      activities.push({
        id: `roommate-${roommate.id}`,
        type: 'tenant',
        title: t('ownerSpace.recentActivity.activities.newRoommate'),
        description: t('ownerSpace.recentActivity.activities.newTenantDescription', { 
          tenant: roommate.name,
          number: roommate.property.split(' ').pop() || 'N/A'
        }),
        time: getTimeAgo(roommate.moveInDate!),
        status: 'info',
        icon: User,
        date: new Date(roommate.moveInDate!)
      });
    });

    // Inspections récentes
    const recentInspections = inspections
      .filter(inspection => inspection.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);

    recentInspections.forEach(inspection => {
      activities.push({
        id: `inspection-${inspection.id}`,
        type: 'inspection',
        title: t('ownerSpace.recentActivity.activities.inspectionCompleted'),
        description: `${inspection.type} - ${inspection.property}`,
        time: getTimeAgo(inspection.date),
        status: 'success',
        icon: Home,
        date: new Date(inspection.date)
      });
    });

    // Contrats récemment signés
    const recentContracts = contracts
      .filter(contract => contract.signedDate && contract.status === 'Signé')
      .sort((a, b) => new Date(b.signedDate!).getTime() - new Date(a.signedDate!).getTime())
      .slice(0, 1);

    recentContracts.forEach(contract => {
      activities.push({
        id: `contract-${contract.id}`,
        type: 'contract',
        title: t('ownerSpace.recentActivity.activities.contractSigned'),
        description: `${contract.tenant} - ${contract.property}`,
        time: getTimeAgo(contract.signedDate!),
        status: 'success',
        icon: CheckCircle,
        date: new Date(contract.signedDate!)
      });
    });

    // Paiements en retard
    const latePayments = payments
      .filter(p => p.status === 'En retard')
      .slice(0, 1);

    latePayments.forEach(payment => {
      activities.push({
        id: `late-${payment.id}`,
        type: 'payment',
        title: t('ownerSpace.recentActivity.activities.latePayment'),
        description: `${payment.tenantName || 'Locataire'} - ${payment.property}`,
        time: getTimeAgo(payment.dueDate),
        status: 'warning',
        icon: AlertCircle,
        date: new Date(payment.dueDate)
      });
    });

    // Trier par date et retourner les 5 plus récentes
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return t('ownerSpace.recentActivity.timeAgo.hoursAgo', { count: diffInHours });
    } else if (diffInHours < 48) {
      return t('ownerSpace.recentActivity.timeAgo.yesterday');
    } else if (diffInDays < 7) {
      return t('ownerSpace.recentActivity.timeAgo.daysAgo', { count: diffInDays });
    } else {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return t('ownerSpace.recentActivity.timeAgo.weeksAgo', { count: diffInWeeks });
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
              <p className="text-gray-500">{t('ownerSpace.recentActivity.noActivity')}</p>
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
