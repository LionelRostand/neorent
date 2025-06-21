
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  Users, 
  UserCheck, 
  FileText, 
  ClipboardList, 
  DollarSign, 
  Calculator 
} from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseCharges } from '@/hooks/useFirebaseCharges';

interface OwnerMenuOverviewProps {
  ownerProfile: any;
}

const OwnerMenuOverview: React.FC<OwnerMenuOverviewProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { properties } = useFirebaseProperties();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { contracts } = useFirebaseContracts();
  const { inspections } = useFirebaseInspections();
  const { payments } = useFirebasePayments();
  const { charges } = useFirebaseCharges();

  // Filtrer les données selon le propriétaire connecté
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const activeTenants = tenants.filter(tenant => 
    tenant.status === 'Actif' && 
    ownerProperties.some(property => property.title === tenant.property)
  );

  const activeRoommates = roommates.filter(roommate => 
    roommate.status === 'Actif' && 
    ownerProperties.some(property => property.title === roommate.property)
  );

  const activeContracts = contracts.filter(contract => 
    contract.status === 'Actif' && 
    ownerProperties.some(property => property.title === contract.property)
  );

  const recentInspections = inspections.filter(inspection => 
    ownerProperties.some(property => property.title === inspection.property)
  );

  const ownerPayments = payments.filter(payment => 
    ownerProperties.some(property => property.title === payment.property)
  );

  const pendingPayments = ownerPayments.filter(payment => payment.status === 'En attente');

  const ownerCharges = charges.filter(charge => 
    ownerProperties.some(property => property.title === charge.propertyName)
  );

  const menuOverviews = [
    {
      title: t('navigation.properties'),
      icon: Building,
      color: 'bg-blue-500',
      count: ownerProperties.length,
      description: `${ownerProperties.length} propriétés gérées`,
      details: `${ownerProperties.filter(p => p.status === 'Occupé').length} occupées`
    },
    {
      title: t('navigation.tenants'),
      icon: Users,
      color: 'bg-green-500',
      count: activeTenants.length,
      description: `${activeTenants.length} locataires actifs`,
      details: `${tenants.filter(t => t.status === 'Inactif').length} inactifs`
    },
    {
      title: t('navigation.roommates'),
      icon: UserCheck,
      color: 'bg-purple-500',
      count: activeRoommates.length,
      description: `${activeRoommates.length} colocataires actifs`,
      details: `${roommates.filter(r => r.status === 'Inactif').length} inactifs`
    },
    {
      title: t('navigation.contracts'),
      icon: FileText,
      color: 'bg-orange-500',
      count: activeContracts.length,
      description: `${activeContracts.length} contrats actifs`,
      details: `${contracts.filter(c => c.status === 'Expiré').length} expirés`
    },
    {
      title: t('navigation.inspections'),
      icon: ClipboardList,
      color: 'bg-indigo-500',
      count: recentInspections.length,
      description: `${recentInspections.length} états des lieux`,
      details: `${recentInspections.filter(i => i.status === 'Planifié').length} planifiés`
    },
    {
      title: t('navigation.rentManagement'),
      icon: DollarSign,
      color: 'bg-red-500',
      count: ownerPayments.length,
      description: `${ownerPayments.length} paiements suivis`,
      details: `${pendingPayments.length} en attente`
    },
    {
      title: t('navigation.rentalCharges'),
      icon: Calculator,
      color: 'bg-yellow-500',
      count: ownerCharges.length,
      description: `${ownerCharges.length} charges gérées`,
      details: `${ownerCharges.length} enregistrées`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Aperçu des menus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuOverviews.map((menu) => {
            const Icon = menu.icon;
            return (
              <div
                key={menu.title}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${menu.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {menu.title}
                    </h3>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {menu.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{menu.description}</p>
                  <p className="text-xs text-gray-500">{menu.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerMenuOverview;
