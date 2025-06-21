
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';

const ContractPreview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card className="mt-2 border-l-4 border-l-green-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Contrats actifs</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>En cours</span>
            <span className="font-medium">3</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>À renouveler</span>
            <span className="font-medium text-orange-600">1</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Calendar className="h-3 w-3" />
            <span>Prochain renouvellement: Mars 2025</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractPreview;
