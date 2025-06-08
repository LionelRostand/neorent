
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface FinancialMetricsProps {
  revenus: number;
  depenses: number;
  benefice: number;
  transactionsCount: number;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ 
  revenus, 
  depenses, 
  benefice, 
  transactionsCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Revenus"
        value={`${revenus}€`}
        description="Revenus ce mois"
        icon={TrendingUp}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title="Dépenses"
        value={`${depenses}€`}
        description="Dépenses ce mois"
        icon={TrendingDown}
        iconBgColor="bg-red-500"
        borderColor="border-l-red-500"
      />
      <MetricCard
        title="Bénéfice"
        value={`${benefice}€`}
        description="Bénéfice net"
        icon={DollarSign}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
      <MetricCard
        title="Transactions"
        value={transactionsCount}
        description={`${transactionsCount} transaction${transactionsCount > 1 ? 's' : ''} ce mois`}
        icon={CreditCard}
        iconBgColor="bg-purple-500"
        borderColor="border-l-purple-500"
      />
    </div>
  );
};

export default FinancialMetrics;
