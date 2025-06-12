
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
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
    <Card className={`border-l-4 ${borderColor} bg-white hover:shadow-md transition-shadow`}>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-2 sm:space-y-3">
          {/* Icon and title row */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-2 sm:p-2.5 lg:p-3 rounded-full ${iconBgColor} flex-shrink-0`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 truncate flex-1">{title}</h3>
          </div>
          
          {/* Value */}
          <div className="text-center sm:text-left">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs sm:text-sm text-gray-600 leading-tight">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
