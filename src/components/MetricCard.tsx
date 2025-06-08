
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
    <Card className={`border-l-4 ${borderColor} bg-white`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Icon className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
