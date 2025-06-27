
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  borderColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor,
  borderColor
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${borderColor} p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider truncate mb-1 sm:mb-2">
            {title}
          </h3>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {value}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <div className={`${iconBgColor} rounded-lg p-2 sm:p-2.5 lg:p-3 flex-shrink-0`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
