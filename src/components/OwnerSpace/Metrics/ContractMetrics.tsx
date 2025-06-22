
import { FileText, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

interface ContractMetricsProps {
  contracts: any[];
}

export const useContractMetrics = ({ contracts }: ContractMetricsProps) => {
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const expiringContracts = contracts.filter(contract => {
    if (!contract.endDate) return false;
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;
  const pendingContracts = contracts.filter(c => c.status === 'Pending').length;

  return [
    {
      title: 'Total Contracts',
      value: totalContracts,
      description: `${totalContracts} total contracts`,
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Contracts',
      value: activeContracts,
      description: `${activeContracts} ongoing contracts`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Expiring Soon',
      value: expiringContracts,
      description: `${expiringContracts} contracts in 30 days`,
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Pending',
      value: pendingContracts,
      description: `${pendingContracts} contracts to validate`,
      icon: Calendar,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];
};
