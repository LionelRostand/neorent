
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Users, Home, Calculator, Wrench, Building } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { QuickAction } from './types';

export const useQuickActionsData = (
  ownerProfile: any,
  setOpenDialog: (dialog: string | null) => void
): QuickAction[] => {
  const { t } = useTranslation();
  const { properties } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();
  const { contracts } = useFirebaseContracts();
  const { payments } = useFirebasePayments();

  return useMemo(() => {
    // Filtrer les données selon le propriétaire connecté
    const ownerProperties = properties.filter(property => 
      property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
    );

    const activeTenants = roommates.filter(roommate => 
      roommate.status === 'Actif' && 
      ownerProperties.some(property => property.title === roommate.property)
    );

    const expiringContracts = contracts.filter(contract => {
      if (!contract.endDate) return false;
      const endDate = new Date(contract.endDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    const pendingPayments = payments.filter(payment => 
      payment.status === 'En attente' && 
      ownerProperties.some(property => property.title === payment.property)
    ).length;

    return [
      {
        title: t('ownerSpace.quickActions.newProperty.title'),
        description: t('ownerSpace.quickActions.newProperty.description'),
        icon: Plus,
        color: 'bg-blue-500',
        action: () => setOpenDialog('property'),
        preview: `${ownerProperties.length} propriétés`,
        previewIcon: Building
      },
      {
        title: t('ownerSpace.quickActions.newContract.title'),
        description: t('ownerSpace.quickActions.newContract.description'),
        icon: FileText,
        color: 'bg-green-500',
        action: () => console.log('Nouveau contrat - À implémenter'),
        preview: `${expiringContracts} contrats expirent bientôt`,
        previewIcon: FileText
      },
      {
        title: t('ownerSpace.quickActions.addTenant.title'),
        description: t('ownerSpace.quickActions.addTenant.description'),
        icon: Users,
        color: 'bg-purple-500',
        action: () => setOpenDialog('roommate'),
        preview: `${activeTenants.length} locataires actifs`,
        previewIcon: Users
      },
      {
        title: t('ownerSpace.quickActions.propertyInspection.title'),
        description: t('ownerSpace.quickActions.propertyInspection.description'),
        icon: Home,
        color: 'bg-orange-500',
        action: () => setOpenDialog('inspection'),
        preview: '2 inspections programmées',
        previewIcon: Home
      },
      {
        title: t('ownerSpace.quickActions.calculateCharges.title'),
        description: t('ownerSpace.quickActions.calculateCharges.description'),
        icon: Calculator,
        color: 'bg-indigo-500',
        action: () => console.log('Calculer charges - À implémenter'),
        preview: `${pendingPayments} paiements en attente`,
        previewIcon: Calculator
      },
      {
        title: t('ownerSpace.quickActions.maintenance.title'),
        description: t('ownerSpace.quickActions.maintenance.description'),
        icon: Wrench,
        color: 'bg-red-500',
        action: () => console.log('Maintenance - À implémenter'),
        preview: '1 demande urgente',
        previewIcon: Wrench
      }
    ];
  }, [
    t,
    properties,
    roommates,
    contracts,
    payments,
    ownerProfile,
    setOpenDialog
  ]);
};
