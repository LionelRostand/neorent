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

  // Filter owner's properties
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  // Get property titles for filtering
  const ownerPropertyTitles = ownerProperties.map(p => p.title);

  // Filter tenants and roommates based on owner's properties
  const ownerTenants = tenants.filter(tenant => 
    ownerPropertyTitles.includes(tenant.property)
  );

  const ownerRoommates = roommates.filter(roommate => 
    ownerPropertyTitles.includes(roommate.property)
  );

  // Filter contracts based on owner's properties
  const ownerContracts = contracts.filter(contract => 
    ownerPropertyTitles.includes(contract.property)
  );

  // Filter inspections based on owner's properties
  const ownerInspections = inspections.filter(inspection => 
    ownerPropertyTitles.includes(inspection.property)
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
            title: 'Total des Biens',
            value: totalProperties,
            description: `${totalProperties} propriétés dans votre portefeuille`,
            icon: Building,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Biens Disponibles',
            value: availableProperties,
            description: `${availableProperties} propriétés libres`,
            icon: Home,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Biens Loués',
            value: rentedProperties,
            description: `${rentedProperties} propriétés occupées`,
            icon: CheckCircle,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Loyer Moyen',
            value: `${avgRent}€`,
            description: 'Loyer moyen par propriété',
            icon: DollarSign,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
          }
        ];

      case 'contract':
        const totalContracts = ownerContracts.length;
        const activeContracts = ownerContracts.filter(c => c.status === 'Actif').length;
        const expiringContracts = ownerContracts.filter(contract => {
          if (!contract.endDate) return false;
          const endDate = new Date(contract.endDate);
          const today = new Date();
          const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length;
        const pendingContracts = ownerContracts.filter(c => c.status === 'En attente').length;

        return [
          {
            title: 'Total Contrats',
            value: totalContracts,
            description: `${totalContracts} contrats au total`,
            icon: FileText,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Contrats Actifs',
            value: activeContracts,
            description: `${activeContracts} contrats en cours`,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Expirent Bientôt',
            value: expiringContracts,
            description: `${expiringContracts} contrats dans 30 jours`,
            icon: AlertTriangle,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            title: 'En Attente',
            value: pendingContracts,
            description: `${pendingContracts} contrats à valider`,
            icon: Calendar,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ];

      case 'roommate':
        const totalRoommates = ownerRoommates.length;
        const activeRoommates = ownerRoommates.filter(r => r.status === 'Actif').length;
        const totalRoomsInProperties = ownerProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);
        const availableRooms = totalRoomsInProperties - activeRoommates;
        const avgRoommateRent = activeRoommates > 0 
          ? Math.round(ownerRoommates.filter(r => r.status === 'Actif').reduce((sum, r) => sum + (Number(r.rentAmount) || 0), 0) / activeRoommates)
          : 0;

        return [
          {
            title: 'Total Colocataires',
            value: totalRoommates,
            description: `${totalRoommates} colocataires enregistrés`,
            icon: Users,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Colocataires Actifs',
            value: activeRoommates,
            description: `${activeRoommates} colocataires présents`,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Chambres Libres',
            value: availableRooms,
            description: `${availableRooms} chambres disponibles`,
            icon: Home,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Loyer Moyen',
            value: `${avgRoommateRent}€`,
            description: 'Loyer moyen par chambre',
            icon: DollarSign,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
          }
        ];

      case 'inspection':
        const totalInspections = ownerInspections.length;
        const completedInspections = ownerInspections.filter(i => i.status === 'Terminée' || i.status === 'Terminé').length;
        const pendingInspections = ownerInspections.filter(i => i.status === 'Programmée' || i.status === 'Planifié').length;
        const thisMonthInspections = ownerInspections.filter(i => {
          if (!i.date) return false;
          const inspectionDate = new Date(i.date);
          const now = new Date();
          return inspectionDate.getMonth() === now.getMonth() && inspectionDate.getFullYear() === now.getFullYear();
        }).length;

        return [
          {
            title: 'Total Inspections',
            value: totalInspections,
            description: `${totalInspections} inspections au total`,
            icon: CheckCircle,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Terminées',
            value: completedInspections,
            description: `${completedInspections} inspections réalisées`,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Programmées',
            value: pendingInspections,
            description: `${pendingInspections} inspections planifiées`,
            icon: Calendar,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Ce Mois',
            value: thisMonthInspections,
            description: `${thisMonthInspections} inspections ce mois`,
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
          }
        ];

      case 'charges':
        // For charges view, we'll show general property metrics
        const totalProperties = ownerProperties.length;
        const rentedProperties = ownerProperties.filter(p => p.status === 'Loué').length;
        const avgRent = ownerProperties.length > 0 
          ? Math.round(ownerProperties.reduce((sum, p) => sum + (Number(p.rent) || 0), 0) / ownerProperties.length)
          : 0;
        const totalRooms = ownerProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);

        return [
          {
            title: 'Total Properties',
            value: totalProperties,
            description: `${totalProperties} properties in portfolio`,
            icon: Building,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Rented Properties',
            value: rentedProperties,
            description: `${rentedProperties} properties occupied`,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Average Rent',
            value: `${avgRent}€`,
            description: 'Average rent per property',
            icon: DollarSign,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
          },
          {
            title: 'Total Rooms',
            value: totalRooms,
            description: 'Total rooms across properties',
            icon: Home,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
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
