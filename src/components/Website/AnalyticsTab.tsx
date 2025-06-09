
import React, { useEffect } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { AnalyticsHeader } from './AnalyticsHeader';
import { TrackingStatus } from './TrackingStatus';
import { StatsCards } from './StatsCards';
import { WeeklyChart } from './WeeklyChart';

const AnalyticsTab = () => {
  const { analyticsData, isLoading, hasRealData, fetchAnalyticsData } = useAnalyticsTracking();

  useEffect(() => {
    fetchAnalyticsData(); // Chargement initial
  }, [fetchAnalyticsData]);

  return (
    <div className="space-y-4 md:space-y-6">
      <AnalyticsHeader onRefresh={fetchAnalyticsData} isLoading={isLoading} />
      
      <TrackingStatus hasRealData={hasRealData} />

      <StatsCards analyticsData={analyticsData} hasRealData={hasRealData} />

      <WeeklyChart analyticsData={analyticsData} hasRealData={hasRealData} />
    </div>
  );
};

export default AnalyticsTab;
