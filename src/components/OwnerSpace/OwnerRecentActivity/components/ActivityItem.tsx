
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getIconColor } from '../utils/styleUtils';

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    status: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const { t } = useTranslation();
  const Icon = activity.icon;

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
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
};

export default ActivityItem;
