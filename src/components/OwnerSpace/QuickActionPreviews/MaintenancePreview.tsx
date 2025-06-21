
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, AlertCircle } from 'lucide-react';

const MaintenancePreview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card className="mt-2 border-l-4 border-l-red-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Maintenance</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Demandes ouvertes</span>
            <span className="font-medium text-red-600">3</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>En cours</span>
            <span className="font-medium text-orange-600">1</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <AlertCircle className="h-3 w-3" />
            <span>Urgence: Plomberie Apt 8</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenancePreview;
