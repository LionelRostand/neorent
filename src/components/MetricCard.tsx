
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
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
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${borderColor} p-4 sm:p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider truncate">
            {title}
          </h3>
          <div className="mt-1 sm:mt-2">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {value}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              {description}
            </p>
          </div>
        </div>
        <div className={`${iconBgColor} rounded-lg p-2 sm:p-3 flex-shrink-0 ml-3`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
