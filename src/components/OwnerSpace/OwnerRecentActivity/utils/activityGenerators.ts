
import { CheckCircle, AlertCircle, User, Home } from 'lucide-react';

export const generatePaymentActivities = (payments: any[], tenants: any[], roommates: any[], t: any, i18n: any) => {
  const recentPayments = payments
    .filter(payment => payment.paymentDate && payment.status === 'Payé')
    .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
    .slice(0, 3);

  return recentPayments.map(payment => {
    const tenant = [...tenants, ...roommates].find(t => 
      t.property === payment.property && t.status === 'Actif'
    );
    return {
      id: `payment-${payment.id}`,
      type: 'payment',
      title: t('ownerSpace.recentActivity.activities.paymentReceived', { 
        number: payment.property.split(' ').pop() || 'N/A' 
      }),
      description: t('ownerSpace.recentActivity.activities.paymentDescription', { 
        tenant: tenant?.name || payment.tenantName || 'Locataire', 
        month: new Date(payment.paymentDate!).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { month: 'long' })
      }),
      time: getTimeAgo(payment.paymentDate!, t),
      status: 'success',
      icon: CheckCircle,
      date: new Date(payment.paymentDate!)
    };
  });
};

export const generateTenantActivities = (tenants: any[], t: any) => {
  const recentTenants = tenants
    .filter(tenant => tenant.status === 'Actif' && tenant.leaseStart)
    .sort((a, b) => {
      const dateA = new Date(a.leaseStart || 0);
      const dateB = new Date(b.leaseStart || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 2);

  return recentTenants.map(tenant => ({
    id: `tenant-${tenant.id}`,
    type: 'tenant',
    title: t('ownerSpace.recentActivity.activities.newTenant'),
    description: t('ownerSpace.recentActivity.activities.newTenantDescription', { 
      tenant: tenant.name,
      number: tenant.property.split(' ').pop() || 'N/A'
    }),
    time: getTimeAgo(tenant.leaseStart!, t),
    status: 'info',
    icon: User,
    date: new Date(tenant.leaseStart!)
  }));
};

export const generateRoommateActivities = (roommates: any[], t: any) => {
  const recentRoommates = roommates
    .filter(roommate => roommate.status === 'Actif' && roommate.moveInDate)
    .sort((a, b) => {
      const dateA = new Date(a.moveInDate || 0);
      const dateB = new Date(b.moveInDate || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 2);

  return recentRoommates.map(roommate => ({
    id: `roommate-${roommate.id}`,
    type: 'tenant',
    title: t('ownerSpace.recentActivity.activities.newRoommate'),
    description: t('ownerSpace.recentActivity.activities.newTenantDescription', { 
      tenant: roommate.name,
      number: roommate.property.split(' ').pop() || 'N/A'
    }),
    time: getTimeAgo(roommate.moveInDate!, t),
    status: 'info',
    icon: User,
    date: new Date(roommate.moveInDate!)
  }));
};

export const generateInspectionActivities = (inspections: any[], t: any) => {
  const recentInspections = inspections
    .filter(inspection => inspection.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return recentInspections.map(inspection => ({
    id: `inspection-${inspection.id}`,
    type: 'inspection',
    title: t('ownerSpace.recentActivity.activities.inspectionCompleted'),
    description: `${inspection.type} - ${inspection.property}`,
    time: getTimeAgo(inspection.date, t),
    status: 'success',
    icon: Home,
    date: new Date(inspection.date)
  }));
};

export const generateContractActivities = (contracts: any[], t: any) => {
  const recentContracts = contracts
    .filter(contract => contract.signedDate && contract.status === 'Signé')
    .sort((a, b) => new Date(b.signedDate!).getTime() - new Date(a.signedDate!).getTime())
    .slice(0, 1);

  return recentContracts.map(contract => ({
    id: `contract-${contract.id}`,
    type: 'contract',
    title: t('ownerSpace.recentActivity.activities.contractSigned'),
    description: `${contract.tenant} - ${contract.property}`,
    time: getTimeAgo(contract.signedDate!, t),
    status: 'success',
    icon: CheckCircle,
    date: new Date(contract.signedDate!)
  }));
};

export const generateLatePaymentActivities = (payments: any[], t: any) => {
  const latePayments = payments
    .filter(p => p.status === 'En retard')
    .slice(0, 1);

  return latePayments.map(payment => ({
    id: `late-${payment.id}`,
    type: 'payment',
    title: t('ownerSpace.recentActivity.activities.latePayment'),
    description: `${payment.tenantName || 'Locataire'} - ${payment.property}`,
    time: getTimeAgo(payment.dueDate, t),
    status: 'warning',
    icon: AlertCircle,
    date: new Date(payment.dueDate)
  }));
};

export const getTimeAgo = (dateString: string, t: any) => {
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
