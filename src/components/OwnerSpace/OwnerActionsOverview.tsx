
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Users, Home, Calculator, Wrench } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';

interface OwnerActionsOverviewProps {
  ownerProfile: any;
}

const OwnerActionsOverview: React.FC<OwnerActionsOverviewProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { properties } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();
  const { inspections } = useFirebaseInspections();

  // Filtrer les données selon le propriétaire connecté
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const ownerTenants = roommates.filter(roommate => 
    roommate.status === 'Actif' && 
    ownerProperties.some(property => property.title === roommate.property)
  );

  const ownerInspections = inspections.filter(inspection =>
    ownerProperties.some(property => property.title === inspection.property)
  );

  const pendingInspections = ownerInspections.filter(inspection => 
    inspection.status === 'Planifié'
  ).length;

  const completedInspections = ownerInspections.filter(inspection => 
    inspection.status === 'Terminé' && 
    new Date(inspection.date).getMonth() === new Date().getMonth()
  ).length;

  const contractsToRenew = ownerTenants.filter(tenant => {
    // Simpler logic pour les contrats à renouveler (dans les 3 prochains mois)
    const endDate = new Date(tenant.leaseEnd || '2025-12-31');
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return endDate <= threeMonthsFromNow;
  }).length;

  // Calcul des revenus mensuels
  const monthlyRevenue = ownerProperties.reduce((total, property) => {
    return total + parseFloat(property.rent || '0');
  }, 0);

  const actionPreviews = [
    {
      title: t('ownerSpace.quickActions.newProperty.title'),
      icon: Plus,
      color: 'bg-blue-500',
      stats: [
        { label: 'Propriétés gérées', value: ownerProperties.length },
        { label: 'Revenus mensuels', value: `${monthlyRevenue.toLocaleString()}€` }
      ]
    },
    {
      title: t('ownerSpace.quickActions.newContract.title'),
      icon: FileText,
      color: 'bg-green-500',
      stats: [
        { label: 'Contrats actifs', value: ownerTenants.length },
        { label: 'À renouveler', value: contractsToRenew }
      ]
    },
    {
      title: t('ownerSpace.quickActions.addTenant.title'),
      icon: Users,
      color: 'bg-purple-500',
      stats: [
        { label: 'Locataires actifs', value: ownerTenants.length },
        { label: 'Places libres', value: ownerProperties.reduce((total, prop) => total + (prop.availableRooms || 0), 0) }
      ]
    },
    {
      title: t('ownerSpace.quickActions.propertyInspection.title'),
      icon: Home,
      color: 'bg-orange-500',
      stats: [
        { label: 'Planifiés', value: pendingInspections },
        { label: 'Terminés ce mois', value: completedInspections }
      ]
    },
    {
      title: t('ownerSpace.quickActions.calculateCharges.title'),
      icon: Calculator,
      color: 'bg-indigo-500',
      stats: [
        { label: 'Total 2024', value: '2,450€' },
        { label: 'Évolution', value: '+3.2%' }
      ]
    },
    {
      title: t('ownerSpace.quickActions.maintenance.title'),
      icon: Wrench,
      color: 'bg-red-500',
      stats: [
        { label: 'Demandes ouvertes', value: 3 },
        { label: 'En cours', value: 1 }
      ]
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Aperçu des actions
        </h2>
        <p className="text-gray-600 text-sm">État actuel de vos activités de gestion</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actionPreviews.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {action.stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className="font-medium text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerActionsOverview;
