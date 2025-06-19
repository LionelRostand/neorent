
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calculator, Building2, Receipt } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

interface ChargeMetricsProps {
  totalCharges: number;
  averageCharges: number;
  propertiesCount: number;
  highestCharge: number;
}

const ChargeMetrics: React.FC<ChargeMetricsProps> = ({
  totalCharges,
  averageCharges,
  propertiesCount,
  highestCharge
}) => {
  const { t } = useTranslation();

  const getPropertiesDescription = () => {
    if (propertiesCount === 0) return t('rentalCharges.forProperty', { count: 0 });
    if (propertiesCount === 1) return t('rentalCharges.forProperty', { count: 1 });
    return t('rentalCharges.forProperties', { count: propertiesCount });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={t('rentalCharges.totalCharges')}
        value={`${totalCharges.toFixed(2)}€`}
        description={getPropertiesDescription()}
        icon={DollarSign}
        iconBgColor="bg-green-500"
        borderColor="border-l-green-500"
      />
      <MetricCard
        title={t('rentalCharges.averageCharges')}
        value={`${averageCharges.toFixed(2)}€`}
        description={t('rentalCharges.averageMonthlyCharges')}
        icon={Calculator}
        iconBgColor="bg-blue-500"
        borderColor="border-l-blue-500"
      />
      <MetricCard
        title={t('rentalCharges.propertiesWithCharges')}
        value={propertiesCount}
        description={`${propertiesCount} ${propertiesCount <= 1 ? t('rentalCharges.property').toLowerCase() : t('rentalCharges.property').toLowerCase() + 's'} ${t('rentalCharges.thisMonth')}`}
        icon={Building2}
        iconBgColor="bg-purple-500"
        borderColor="border-l-purple-500"
      />
      <MetricCard
        title={t('rentalCharges.highestCharge')}
        value={`${highestCharge.toFixed(2)}€`}
        description={t('rentalCharges.propertyWithMostCharges')}
        icon={Receipt}
        iconBgColor="bg-orange-500"
        borderColor="border-l-orange-500"
      />
    </div>
  );
};

export default ChargeMetrics;
