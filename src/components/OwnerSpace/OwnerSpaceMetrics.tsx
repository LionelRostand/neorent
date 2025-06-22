
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Home, Users, DollarSign, FileText, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';

interface OwnerSpaceMetricsProps {
  ownerProfile: any;
  activeView: string;
}

const OwnerSpaceMetrics: React.FC<OwnerSpaceMetricsProps> = ({ ownerProfile, activeView }) => {
  const { t } = useTranslation();
  const { properties = [] } = useFirebaseProperties();
  const { roommates = [] } = useFirebaseRoommates();
  const { tenants = [] } = useFirebaseTenants();
  const { payments = [] } = useFirebasePayments();
  const { contracts = [] } = useFirebaseContracts();
  const { inspections = [] } = useFirebaseInspections();

  // Calculate owner properties
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const getMetricsForView = () => {
    switch (activeView) {
      case 'property':
        const totalProperties = ownerProperties.length;
        const availableProperties = ownerProperties.filter(p => p.status === 'Disponible').length;
        const rentedProperties = ownerProperties.filter(p => p.status === 'Loué').length;
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

      case 'contract':
        const totalContracts = contracts.length;
        const activeContracts = contracts.filter(c => c.status === 'Actif').length;
        const expiringContracts = contracts.filter(contract => {
          if (!contract.endDate) return false;
          const endDate = new Date(contract.endDate);
          const today = new Date();
          const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length;
        const pendingContracts = contracts.filter(c => c.status === 'En attente').length;

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

      case 'roommate':
        const totalRoommates = roommates.length;
        const activeRoommates = roommates.filter(r => r.status === 'Actif').length;
        const availableRooms = ownerProperties.length * 2 - activeRoommates; // Assuming 2 rooms per property
        const avgRoommateRent = activeRoommates > 0 
          ? Math.round(roommates.filter(r => r.status === 'Actif').reduce((sum, r) => sum + (Number(r.rentAmount) || 0), 0) / activeRoommates)
          : 0;

        return [
          {
            title: 'Total Roommates',
            value: totalRoommates,
            description: `${totalRoommates} registered roommates`,
            icon: Users,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Active Roommates',
            value: activeRoommates,
            description: `${activeRoommates} current roommates`,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Available Rooms',
            value: availableRooms,
            description: `${availableRooms} rooms available`,
            icon: Home,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Average Rent',
            value: `${avgRoommateRent}€`,
            description: 'Average rent per room',
            icon: DollarSign,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
          }
        ];

      case 'inspection':
        const totalInspections = inspections.length;
        const completedInspections = inspections.filter(i => i.status === 'Terminée').length;
        const pendingInspections = inspections.filter(i => i.status === 'Programmée').length;
        const thisMonthInspections = inspections.filter(i => {
          if (!i.date) return false;
          const inspectionDate = new Date(i.date);
          const now = new Date();
          return inspectionDate.getMonth() === now.getMonth() && inspectionDate.getFullYear() === now.getFullYear();
        }).length;

        return [
          {
            title: 'Total Inspections',
            value: totalInspections,
            description: `${totalInspections} total inspections`,
            icon: CheckCircle,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Completed',
            value: completedInspections,
            description: `${completedInspections} completed inspections`,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Scheduled',
            value: pendingInspections,
            description: `${pendingInspections} planned inspections`,
            icon: Calendar,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'This Month',
            value: thisMonthInspections,
            description: `${thisMonthInspections} inspections this month`,
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
          }
        ];

      default:
        return [];
    }
  };

  const metrics = getMetricsForView();

  if (metrics.length === 0) {
    return null;
  }

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
