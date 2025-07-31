
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Calculator, Building } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { useFinancialForecasting } from '@/hooks/useFinancialForecasting';
import FinancialMetrics from '@/components/Forecasting/FinancialMetrics';
import PropertyProfitability from '@/components/Forecasting/PropertyProfitability';
import PropertyAnalyzer from '@/components/Forecasting/PropertyAnalyzer';
import InvestmentCapacity from '@/components/Forecasting/InvestmentCapacity';

const Forecasting = () => {
  const { t } = useTranslation();
  const {
    financialSummary,
    investmentCapacity,
    loading,
    error
  } = useFinancialForecasting();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Calcul des prévisions financières...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              Prévisions Financières
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Analyse de rentabilité et capacité d'investissement basée sur vos données réelles
            </p>
          </div>
        </div>

        {/* Métriques financières globales */}
        <FinancialMetrics
          totalMonthlyRevenue={financialSummary.totalMonthlyRevenue}
          totalMonthlyProfit={financialSummary.totalMonthlyProfit}
          averageProfitMargin={financialSummary.averageProfitMargin}
          totalAnnualProfit={financialSummary.totalAnnualProfit}
          riskLevel={investmentCapacity.riskLevel}
        />

        {/* Analyseur de propriété individuelle */}
        <PropertyAnalyzer 
          propertiesData={financialSummary.propertiesData}
        />

        {/* Analyse de rentabilité par propriété */}
        <PropertyProfitability 
          propertiesData={financialSummary.propertiesData}
        />

        {/* Capacité d'investissement */}
        <InvestmentCapacity
          availableForInvestment={investmentCapacity.availableForInvestment}
          maxPropertyPrice={investmentCapacity.maxPropertyPrice}
          recommendedDownPayment={investmentCapacity.recommendedDownPayment}
          monthlyBudgetForLoan={investmentCapacity.monthlyBudgetForLoan}
          riskLevel={investmentCapacity.riskLevel}
          recommendations={investmentCapacity.recommendations}
        />
      </div>
    </MainLayout>
  );
};

export default Forecasting;
