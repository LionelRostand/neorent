
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  totalInterventions: number;
  totalCost: number;
  proprietaireCost: number;
  locataireCost: number;
}

const StatsCards = ({
  totalInterventions,
  totalCost,
  proprietaireCost,
  locataireCost
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total interventions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInterventions}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Coût total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCost}€</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Charge propriétaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{proprietaireCost}€</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Charge locataire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{locataireCost}€</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
