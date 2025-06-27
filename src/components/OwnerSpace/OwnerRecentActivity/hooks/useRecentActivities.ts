
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  generatePaymentActivities,
  generateTenantActivities,
  generateRoommateActivities,
  generateInspectionActivities,
  generateContractActivities,
  generateLatePaymentActivities
} from '../utils/activityGenerators';

export const useRecentActivities = (ownerData: any) => {
  const { t, i18n } = useTranslation();
  const { properties, roommates, tenants, payments, contracts, inspections } = ownerData;

  return useMemo(() => {
    const activities = [
      ...generatePaymentActivities(payments, tenants, roommates, t, i18n),
      ...generateTenantActivities(tenants, t),
      ...generateRoommateActivities(roommates, t),
      ...generateInspectionActivities(inspections, t),
      ...generateContractActivities(contracts, t),
      ...generateLatePaymentActivities(payments, t)
    ];

    // Sort by date and return the 5 most recent
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [payments, tenants, roommates, inspections, contracts, t, i18n]);
};
