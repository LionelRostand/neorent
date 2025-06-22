
import { Building, Home, CheckCircle, DollarSign } from 'lucide-react';

interface PropertyMetricsProps {
  ownerProperties: any[];
}

export const usePropertyMetrics = ({ ownerProperties }: PropertyMetricsProps) => {
  const totalProperties = ownerProperties.length;
  const availableProperties = ownerProperties.filter(p => p.status === 'Available').length;
  const rentedProperties = ownerProperties.filter(p => p.status === 'Rented').length;
  const avgRent = ownerProperties.length > 0 
    ? Math.round(ownerProperties.reduce((sum, p) => sum + (Number(p.rent) || 0), 0) / ownerProperties.length)
    : 0;

  return [
    {
      title: 'Total Properties',
      value: totalProperties,
      description: `${totalProperties} properties in your portfolio`,
      icon: Building,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Available Properties',
      value: availableProperties,
      description: `${availableProperties} vacant properties`,
      icon: Home,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rented Properties',
      value: rentedProperties,
      description: `${rentedProperties} occupied properties`,
      icon: CheckCircle,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Average Rent',
      value: `${avgRent}€`,
      description: 'Average rent per property',
      icon: DollarSign,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];
};
