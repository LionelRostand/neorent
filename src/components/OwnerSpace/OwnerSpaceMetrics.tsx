
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Home, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

interface OwnerSpaceMetricsProps {
  ownerProfile: any;
}

const OwnerSpaceMetrics: React.FC<OwnerSpaceMetricsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { properties = [] } = useFirebaseProperties();
  const { roommates = [] } = useFirebaseRoommates();
  const { tenants = [] } = useFirebaseTenants();
  const { payments = [] } = useFirebasePayments();

  // Calculate owner properties
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  // Calculate total rooms/properties
  const totalProperties = ownerProperties.length;

  // Calculate occupied rooms
  const activeRoommates = roommates.filter(r => r.status === 'Actif');
  const activeTenants = tenants.filter(t => t.status === 'Actif');
  const totalOccupied = activeRoommates.length + activeTenants.length;
  const totalAvailable = totalProperties * 3; // Assuming 3 rooms per property on average
  const occupationRate = totalAvailable > 0 ? Math.round((totalOccupied / totalAvailable) * 100) : 0;

  // Calculate roommate rooms
  const roommateRooms = activeRoommates.length;
  const totalRoommateCapacity = totalProperties * 2; // Assuming 2 roommate rooms per property

  // Calculate monthly revenue
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = payments
    .filter(payment => {
      if (!payment.paymentDate || payment.status !== 'Payé') return false;
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum, payment) => sum + payment.rentAmount, 0);

  const metrics = [
    {
      title: 'Total des Biens',
      value: totalProperties,
      description: `${totalProperties} propriétés dans votre portefeuille`,
      icon: Building,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Taux d'Occupation",
      value: `${occupationRate}%`,
      description: `${occupationRate}% de vos propriétés sont occupées`,
      icon: Home,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Chambres Colocation',
      value: `${roommateRooms}/${totalRoommateCapacity}`,
      description: `${roommateRooms} chambres occupées`,
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Revenus Mensuels',
      value: `${monthlyRevenue}€`,
      description: 'Revenus réels perçus',
      icon: DollarSign,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {metric.description}
                  </p>
                </div>
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OwnerSpaceMetrics;
