
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Calculator,
  PiggyBank,
  Building,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface SimulationResultsProps {
  requiredDownPayment: number;
  projectedSavings: number;
  monthlyLoanPayment: number;
  profitability: number;
  downPaymentPercent: string;
  timeframe: string;
  loanDuration: string;
  loanRate: string;
  canAffordProperty: boolean;
  monthsToSave: number;
  currentMonthlyRevenue: number;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({
  requiredDownPayment,
  projectedSavings,
  monthlyLoanPayment,
  profitability,
  downPaymentPercent,
  timeframe,
  loanDuration,
  loanRate,
  canAffordProperty,
  monthsToSave,
  currentMonthlyRevenue
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Target className="h-5 w-5" />
          {t('forecasting.simulationResults')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t('forecasting.requiredDownPayment')}</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {requiredDownPayment.toLocaleString()}€
            </div>
            <p className="text-xs text-blue-700">
              {downPaymentPercent}% {t('forecasting.ofPurchasePrice')}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">{t('forecasting.projectedSavings')}</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {projectedSavings.toLocaleString()}€
            </div>
            <p className="text-xs text-green-700">
              {t('forecasting.overMonths', { months: timeframe })}
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">{t('forecasting.loanPayment')}</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(monthlyLoanPayment).toLocaleString()}€
            </div>
            <p className="text-xs text-orange-700">
              {t('forecasting.overYearsAtRate', { years: loanDuration, rate: loanRate })}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${profitability >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`h-5 w-5 ${profitability >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm font-medium ${profitability >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                {t('forecasting.monthlyCashFlow')}
              </span>
            </div>
            <div className={`text-2xl font-bold ${profitability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitability >= 0 ? '+' : ''}{Math.round(profitability).toLocaleString()}€
            </div>
            <p className={`text-xs ${profitability >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {t('forecasting.rentMinusPayment')}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Faisabilité du projet */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">{t('forecasting.feasibilityAnalysis')}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 ${canAffordProperty ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {canAffordProperty ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${canAffordProperty ? 'text-green-800' : 'text-red-800'}`}>
                  {t('forecasting.financingCapacity')}
                </span>
              </div>
              <p className={`text-sm ${canAffordProperty ? 'text-green-700' : 'text-red-700'}`}>
                {canAffordProperty 
                  ? t('forecasting.canFinanceProject')
                  : t('forecasting.missingAmount', { amount: (requiredDownPayment - projectedSavings).toLocaleString() })
                }
              </p>
            </div>

            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">{t('forecasting.savingsDelay')}</span>
              </div>
              <p className="text-sm text-blue-700">
                {monthsToSave > 0 
                  ? t('forecasting.monthsNeededForDownPayment', { months: monthsToSave })
                  : t('forecasting.enterMonthlySavingsCapacity')
                }
              </p>
            </div>
          </div>

          {/* Recommandations */}
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">{t('forecasting.recommendations')}</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              {profitability < 0 && (
                <li>• {t('forecasting.recommendationNegativeCashFlow')}</li>
              )}
              {!canAffordProperty && (
                <li>• {t('forecasting.recommendationIncreaseSavings')}</li>
              )}
              {currentMonthlyRevenue > 0 && (
                <li>• {t('forecasting.currentRevenueAllows', { revenue: Math.round(currentMonthlyRevenue) })}</li>
              )}
              <li>• {t('forecasting.considerNotaryFees')}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationResults;
