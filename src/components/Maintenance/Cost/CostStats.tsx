
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CostStatsProps {
  totalCosts: number;
  proprietaireCosts: number;
  locataireCosts: number;
  pendingCosts: number;
}

const CostStats = ({ totalCosts, proprietaireCosts, locataireCosts, pendingCosts }: CostStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Coût total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCosts}€</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Charge propriétaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{proprietaireCosts}€</div>
          <p className="text-xs text-muted-foreground">
            {totalCosts > 0 ? ((proprietaireCosts / totalCosts) * 100).toFixed(1) : 0}% du total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Charge locataire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{locataireCosts}€</div>
          <p className="text-xs text-muted-foreground">
            {totalCosts > 0 ? ((locataireCosts / totalCosts) * 100).toFixed(1) : 0}% du total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">En attente de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{pendingCosts}€</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostStats;
