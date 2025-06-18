
import React from 'react';
import { TrendingUp } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { useForecastingCalculations } from '@/hooks/useForecastingCalculations';
import CurrentRevenueCard from '@/components/Forecasting/CurrentRevenueCard';
import SimulationForm from '@/components/Forecasting/SimulationForm';
import SimulationResults from '@/components/Forecasting/SimulationResults';

const Forecasting = () => {
  const {
    targetPropertyPrice,
    setTargetPropertyPrice,
    targetPropertyRent,
    setTargetPropertyRent,
    downPaymentPercent,
    setDownPaymentPercent,
    loanRate,
    setLoanRate,
    loanDuration,
    setLoanDuration,
    monthlySavingsGoal,
    setMonthlySavingsGoal,
    timeframe,
    setTimeframe,
    propertyType,
    setPropertyType,
    notes,
    setNotes,
    currentMonthlyRevenue,
    projectedSavings,
    requiredDownPayment,
    monthlyLoanPayment,
    profitability,
    canAffordProperty,
    monthsToSave
  } = useForecastingCalculations();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Prévisions d'investissement
            </h1>
            <p className="text-gray-600 mt-2">
              Planifiez vos futurs investissements immobiliers basés sur vos revenus actuels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenus actuels */}
          <div className="lg:col-span-1">
            <CurrentRevenueCard currentMonthlyRevenue={currentMonthlyRevenue} />
          </div>

          {/* Formulaire de prévision */}
          <div className="lg:col-span-2">
            <SimulationForm
              targetPropertyPrice={targetPropertyPrice}
              setTargetPropertyPrice={setTargetPropertyPrice}
              targetPropertyRent={targetPropertyRent}
              setTargetPropertyRent={setTargetPropertyRent}
              downPaymentPercent={downPaymentPercent}
              setDownPaymentPercent={setDownPaymentPercent}
              loanRate={loanRate}
              setLoanRate={setLoanRate}
              loanDuration={loanDuration}
              setLoanDuration={setLoanDuration}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              monthlySavingsGoal={monthlySavingsGoal}
              setMonthlySavingsGoal={setMonthlySavingsGoal}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              notes={notes}
              setNotes={setNotes}
            />
          </div>

          {/* Résultats de la simulation */}
          <div className="lg:col-span-3">
            <SimulationResults
              requiredDownPayment={requiredDownPayment}
              projectedSavings={projectedSavings}
              monthlyLoanPayment={monthlyLoanPayment}
              profitability={profitability}
              downPaymentPercent={downPaymentPercent}
              timeframe={timeframe}
              loanDuration={loanDuration}
              loanRate={loanRate}
              canAffordProperty={canAffordProperty}
              monthsToSave={monthsToSave}
              currentMonthlyRevenue={currentMonthlyRevenue}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Forecasting;
