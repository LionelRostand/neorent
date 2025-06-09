
import { useMemo } from 'react';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { DollarSign, User, Home, Clock } from 'lucide-react';

export const useRecentActivityData = () => {
  const { payments } = useFirebasePayments();
  const { tenants } = useFirebaseTenants();
  const { inspections } = useFirebaseInspections();

  const activities = useMemo(() => {
    const activityList = [];

    // Paiements récents
    const recentPayments = payments
      .filter(p => p.paymentDate && p.status === 'Payé')
      .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
      .slice(0, 2);

    recentPayments.forEach(payment => {
      activityList.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        description: `Loyer reçu - ${payment.property}`,
        amount: `${payment.rentAmount}€`,
        time: formatTimeAgo(payment.paymentDate!),
        icon: DollarSign,
        iconColor: 'bg-green-500'
      });
    });

    // Nouveaux locataires récents
    const recentTenants = tenants
      .filter(t => t.leaseStart)
      .sort((a, b) => new Date(b.leaseStart).getTime() - new Date(a.leaseStart).getTime())
      .slice(0, 1);

    recentTenants.forEach(tenant => {
      activityList.push({
        id: `tenant-${tenant.id}`,
        type: 'tenant',
        description: `Nouveau locataire - ${tenant.name}`,
        time: formatTimeAgo(tenant.leaseStart),
        icon: User,
        iconColor: 'bg-blue-500'
      });
    });

    // Inspections récentes
    const recentInspections = inspections
      .filter(i => i.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 1);

    recentInspections.forEach(inspection => {
      activityList.push({
        id: `inspection-${inspection.id}`,
        type: 'maintenance',
        description: `${inspection.type} - ${inspection.property}`,
        time: formatTimeAgo(inspection.date),
        icon: Home,
        iconColor: 'bg-orange-500'
      });
    });

    // Paiements en retard
    const latePayments = payments
      .filter(p => p.status === 'En retard')
      .slice(0, 1);

    latePayments.forEach(payment => {
      activityList.push({
        id: `late-${payment.id}`,
        type: 'payment',
        description: `Loyer en retard - ${payment.property}`,
        amount: `${payment.rentAmount}€`,
        time: formatTimeAgo(payment.dueDate),
        icon: Clock,
        iconColor: 'bg-red-500'
      });
    });

    return activityList
      .sort((a, b) => getTimeValue(b.time) - getTimeValue(a.time))
      .slice(0, 4);
  }, [payments, tenants, inspections]);

  return activities;
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays}j`;
  } else {
    return `Il y a ${Math.floor(diffInDays / 7)}sem`;
  }
};

const getTimeValue = (timeString: string): number => {
  const match = timeString.match(/(\d+)(h|j|sem)/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'h': return value;
    case 'j': return value * 24;
    case 'sem': return value * 24 * 7;
    default: return 0;
  }
};
