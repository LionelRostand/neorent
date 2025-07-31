import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FinancialMetricsProps {
  totalMonthlyRevenue: number;
  totalMonthlyProfit: number;
  averageProfitMargin: number;
  totalAnnualProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  totalMonthlyRevenue,
  totalMonthlyProfit,
  averageProfitMargin,
  totalAnnualProfit,
  riskLevel
}) => {
  const getRiskBadge = () => {
    const config = {
      low: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600', label: 'Faible Risque' },
      medium: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-yellow-600', label: 'Risque Modéré' },
      high: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600', label: 'Risque Élevé' }
    };
    
    const { variant, icon: Icon, color, label } = config[riskLevel];
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {label}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenus Mensuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalMonthlyRevenue.toLocaleString()}€
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Base de calcul des prévisions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            {totalMonthlyProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            Bénéfices Mensuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalMonthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalMonthlyProfit >= 0 ? '+' : ''}{totalMonthlyProfit.toLocaleString()}€
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Après déduction des charges
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Marge Bénéficiaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${averageProfitMargin >= 20 ? 'text-green-600' : averageProfitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
            {averageProfitMargin.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Rentabilité globale
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Niveau de Risque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getRiskBadge()}
            <div className="text-lg font-semibold text-gray-800">
              {totalAnnualProfit.toLocaleString()}€/an
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetrics;