
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, TrendingUp } from 'lucide-react';

const ChargesPreview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card className="mt-2 border-l-4 border-l-indigo-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium">Charges 2024</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Total provisoire</span>
            <span className="font-medium">2,450€</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Régularisation</span>
            <span className="font-medium text-green-600">+120€</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <TrendingUp className="h-3 w-3" />
            <span>+3.2% vs année précédente</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargesPreview;
