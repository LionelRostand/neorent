import React from 'react';
import { Calculator, TrendingUp, AlertCircle, Home, PiggyBank, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvestmentCapacityProps {
  availableForInvestment: number;
  maxPropertyPrice: number;
  recommendedDownPayment: number;
  monthlyBudgetForLoan: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const InvestmentCapacity: React.FC<InvestmentCapacityProps> = ({
  availableForInvestment,
  maxPropertyPrice,
  recommendedDownPayment,
  monthlyBudgetForLoan,
  riskLevel,
  recommendations
}) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'low': return 'Investissement Recommandé';
      case 'medium': return 'Investissement Possible avec Prudence';
      case 'high': return 'Investissement Non Recommandé';
    }
  };

  const canInvest = maxPropertyPrice > 50000;

  return (
    <div className="space-y-6">
      {/* Résumé de la capacité d'investissement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Capacité d'Investissement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <PiggyBank className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {availableForInvestment.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Disponible/mois</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Home className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {maxPropertyPrice.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Prix max propriété</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">
                {recommendedDownPayment.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Apport recommandé</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">
                {monthlyBudgetForLoan.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Budget prêt/mois</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Évaluation du risque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Évaluation du Risque d'Investissement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${getRiskColor()}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                {getRiskLabel()}
              </h3>
              <Badge variant={riskLevel === 'low' ? 'default' : riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                Risque {riskLevel === 'low' ? 'Faible' : riskLevel === 'medium' ? 'Modéré' : 'Élevé'}
              </Badge>
            </div>
            
            {!canInvest && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Votre capacité d'investissement actuelle est limitée. Concentrez-vous sur l'optimisation de vos revenus existants.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <h4 className="font-medium">Recommandations :</h4>
              <ul className="space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation d'investissement */}
      {canInvest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Simulation d'Investissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Paramètres de Prêt</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux d'intérêt estimé :</span>
                    <span className="font-medium">3.5% / an</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée du prêt :</span>
                    <span className="font-medium">20 ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apport personnel :</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant emprunté :</span>
                    <span className="font-medium">{(maxPropertyPrice * 0.8).toLocaleString()}€</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Rentabilité Attendue</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loyer estimé :</span>
                    <span className="font-medium">{(maxPropertyPrice * 0.004).toFixed(0)}€/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charges estimées :</span>
                    <span className="font-medium">{(maxPropertyPrice * 0.001).toFixed(0)}€/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bénéfice net estimé :</span>
                    <span className="font-medium text-green-600">
                      +{(maxPropertyPrice * 0.003 - monthlyBudgetForLoan).toFixed(0)}€/mois
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI estimé :</span>
                    <span className="font-medium text-green-600">
                      {((maxPropertyPrice * 0.003 * 12 / recommendedDownPayment) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentCapacity;