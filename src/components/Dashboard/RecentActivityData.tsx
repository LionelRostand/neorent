
import { useMemo } from 'react';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { DollarSign, User, Home, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const useRecentActivityData = (payments?: any[], tenants?: any[], inspections?: any[]) => {
  const { t } = useTranslation();
  
  // Utiliser les données passées en props ou les hooks globaux par défaut
  const { payments: globalPayments } = useFirebasePayments();
  const { tenants: globalTenants } = useFirebaseTenants();
  const { inspections: globalInspections } = useFirebaseInspections();
  
  const finalPayments = payments || globalPayments;
  const finalTenants = tenants || globalTenants;
  const finalInspections = inspections || globalInspections;

  const activities = useMemo(() => {
    const activityList = [];

    // Paiements récents
    const recentPayments = finalPayments
      .filter(p => p.paymentDate && p.status === 'Payé')
      .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
      .slice(0, 2);

    recentPayments.forEach(payment => {
      activityList.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        description: `${t('dashboard.rentReceived')} - ${payment.property}`,
        amount: `${payment.rentAmount}€`,
        time: formatTimeAgo(payment.paymentDate!, t),
        icon: DollarSign,
        iconColor: 'bg-green-500'
      });
    });

    // Nouveaux locataires récents
    const recentTenants = finalTenants
      .filter(t => t.leaseStart)
      .sort((a, b) => new Date(b.leaseStart).getTime() - new Date(a.leaseStart).getTime())
      .slice(0, 1);

    recentTenants.forEach(tenant => {
      activityList.push({
        id: `tenant-${tenant.id}`,
        type: 'tenant',
        description: `${t('dashboard.newTenant')} - ${tenant.name}`,
        time: formatTimeAgo(tenant.leaseStart, t),
        icon: User,
        iconColor: 'bg-blue-500'
      });
    });

    // Inspections récentes
    const recentInspections = finalInspections
      .filter(i => i.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 1);

    recentInspections.forEach(inspection => {
      activityList.push({
        id: `inspection-${inspection.id}`,
        type: 'maintenance',
        description: `${inspection.type} - ${inspection.property}`,
        time: formatTimeAgo(inspection.date, t),
        icon: Home,
        iconColor: 'bg-orange-500'
      });
    });

    // Paiements en retard
    const latePayments = finalPayments
      .filter(p => p.status === 'En retard')
      .slice(0, 1);

    latePayments.forEach(payment => {
      activityList.push({
        id: `late-${payment.id}`,
        type: 'payment',
        description: `${t('dashboard.latePayment')} - ${payment.property}`,
        amount: `${payment.rentAmount}€`,
        time: formatTimeAgo(payment.dueDate, t),
        icon: Clock,
        iconColor: 'bg-red-500'
      });
    });

    return activityList
      .sort((a, b) => getTimeValue(b.time) - getTimeValue(a.time))
      .slice(0, 4);
  }, [finalPayments, finalTenants, finalInspections, t]);

  return activities;
};

const formatTimeAgo = (dateString: string, t: any): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 24) {
    return t('dashboard.timeAgo.hours', { hours: diffInHours });
  } else if (diffInDays < 7) {
    return t('dashboard.timeAgo.days', { days: diffInDays });
  } else {
    return t('dashboard.timeAgo.weeks', { weeks: Math.floor(diffInDays / 7) });
  }
};

const getTimeValue = (timeString: string): number => {
  const match = timeString.match(/(\d+)(h|j|d|sem|w)/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'h': return value;
    case 'j':
    case 'd': return value * 24;
    case 'sem':
    case 'w': return value * 24 * 7;
    default: return 0;
  }
};
