
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useRecentActivities } from './OwnerRecentActivity/hooks/useRecentActivities';
import ActivityItem from './OwnerRecentActivity/components/ActivityItem';
import EmptyActivityState from './OwnerRecentActivity/components/EmptyActivityState';

interface OwnerRecentActivityProps {
  ownerProfile: any;
}

const OwnerRecentActivity: React.FC<OwnerRecentActivityProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const ownerData = useOwnerData(ownerProfile);
  const activities = useRecentActivities(ownerData);

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
            <EmptyActivityState />
          ) : (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerRecentActivity;
