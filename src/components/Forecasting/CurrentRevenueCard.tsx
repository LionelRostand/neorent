
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PiggyBank } from 'lucide-react';

interface CurrentRevenueCardProps {
  currentMonthlyRevenue: number;
}

const CurrentRevenueCard: React.FC<CurrentRevenueCardProps> = ({ currentMonthlyRevenue }) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <PiggyBank className="h-5 w-5" />
          Situation actuelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600">Revenus mensuels réels</Label>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(currentMonthlyRevenue).toLocaleString()}€
          </div>
          <p className="text-xs text-gray-500">
            Basé sur les paiements reçus ce mois
          </p>
        </div>

        <Separator />

        <div>
          <Label className="text-sm text-gray-600">Capacité d'épargne recommandée</Label>
          <div className="text-lg font-semibold text-blue-600">
            {Math.round(currentMonthlyRevenue * 0.3).toLocaleString()}€/mois
          </div>
          <p className="text-xs text-gray-500">
            30% des revenus locatifs reçus
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentRevenueCard;
