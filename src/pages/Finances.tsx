
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import FinancesHeader from '@/components/FinancesHeader';
import FinancialMetrics from '@/components/FinancialMetrics';
import FinancialCharts from '@/components/FinancialCharts';
import RecentTransactions from '@/components/RecentTransactions';

const Finances = () => {
  const revenus = 5400;
  const depenses = 950;
  const benefice = revenus - depenses;
  const transactionsCount = 3;

  return (
    <MainLayout>
      <div className="space-y-6">
        <FinancesHeader />

        <FinancialMetrics
          revenus={revenus}
          depenses={depenses}
          benefice={benefice}
          transactionsCount={transactionsCount}
        />

        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de Bord Financier</h2>
        </div>

        <FinancialCharts />

        <RecentTransactions />
      </div>
    </MainLayout>
  );
};

export default Finances;
