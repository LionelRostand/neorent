
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
      description: `${ownerProperties.length} properties managed`,
      details: `${ownerProperties.filter(p => p.status === 'Occupé').length} occupied`
    },
    {
      title: t('navigation.tenants'),
      icon: Users,
      color: 'bg-green-500',
      count: activeTenants.length,
      description: `${activeTenants.length} active tenants`,
      details: `${tenants.filter(t => t.status === 'Inactif').length} inactive`
    },
    {
      title: t('navigation.roommates'),
      icon: UserCheck,
      color: 'bg-purple-500',
      count: activeRoommates.length,
      description: `${activeRoommates.length} active roommates`,
      details: `${roommates.filter(r => r.status === 'Inactif').length} inactive`
    },
    {
      title: t('navigation.contracts'),
      icon: FileText,
      color: 'bg-orange-500',
      count: activeContracts.length,
      description: `${activeContracts.length} active contracts`,
      details: `${contracts.filter(c => c.status === 'Expiré').length} expired`
    },
    {
      title: t('navigation.inspections'),
      icon: ClipboardList,
      color: 'bg-indigo-500',
      count: recentInspections.length,
      description: `${recentInspections.length} property inspections`,
      details: `${recentInspections.filter(i => i.status === 'Planifié').length} scheduled`
    },
    {
      title: t('navigation.rentManagement'),
      icon: DollarSign,
      color: 'bg-red-500',
      count: ownerPayments.length,
      description: `${ownerPayments.length} payments tracked`,
      details: `${pendingPayments.length} pending`
    },
    {
      title: t('navigation.rentalCharges'),
      icon: Calculator,
      color: 'bg-yellow-500',
      count: ownerCharges.length,
      description: `${ownerCharges.length} charges managed`,
      details: `${ownerCharges.length} recorded`
    }
  ];

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-gray-800">
          Menu Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuOverviews.map((menu) => {
            const Icon = menu.icon;
            return (
              <div
                key={menu.title}
                className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-xl ${menu.color} text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {menu.title}
                    </h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      {menu.count}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{menu.description}</p>
                  <p className="text-sm text-gray-500 border-t border-gray-100 pt-2">{menu.details}</p>
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
