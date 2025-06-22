
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor, 
  bgColor 
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {value}
            </p>
            <p className="text-xs text-gray-500">
              {description}
            </p>
          </div>
          <div className={`${bgColor} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
