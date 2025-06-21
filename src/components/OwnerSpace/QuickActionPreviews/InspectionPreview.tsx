
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Clock } from 'lucide-react';

const InspectionPreview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card className="mt-2 border-l-4 border-l-orange-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Home className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">États des lieux</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Planifiés</span>
            <span className="font-medium">2</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Terminés ce mois</span>
            <span className="font-medium">5</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Clock className="h-3 w-3" />
            <span>Prochain: Demain 14h00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionPreview;
