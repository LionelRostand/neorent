
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useFirebaseProperties } from './useFirebaseProperties';
import { useFirebaseTenants } from './useFirebaseTenants';
import { useFirebaseRoommates } from './useFirebaseRoommates';

export const useOwnerSpaceData = () => {
  const { userProfile, userType } = useAuth();
  const { properties } = useFirebaseProperties();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier que l'utilisateur est un propriétaire (employee/admin)
  const currentOwner = userType === 'employee' || userType === 'admin' ? userProfile : null;

  // Filtrer les données par propriétaire
  const ownerProperties = properties.filter(property => 
    property.owner === currentOwner?.name
  );

  // Filtrer les locataires par propriétés du propriétaire
  const ownerTenants = tenants.filter(tenant => 
    ownerProperties.some(property => property.title === tenant.property)
  );

  // Filtrer les colocataires par propriétés du propriétaire
  const ownerRoommates = roommates.filter(roommate => 
    ownerProperties.some(property => property.title === roommate.property)
  );

  // Mock data pour les contrats (à remplacer par de vraies données Firebase)
  const ownerContracts = ownerTenants.map(tenant => ({
    id: `contract-${tenant.id}`,
    tenantName: tenant.name,
    property: tenant.property,
    startDate: tenant.leaseStart,
    endDate: new Date(new Date(tenant.leaseStart).setFullYear(new Date(tenant.leaseStart).getFullYear() + 1)).toISOString().split('T')[0],
    rent: tenant.rentAmount,
    status: 'Actif'
  }));

  useEffect(() => {
    setLoading(false);
    if (!currentOwner) {
      setError('Accès non autorisé - utilisateur non propriétaire');
    }
  }, [currentOwner]);

  console.log('Owner space data:', {
    currentOwner,
    ownerProperties: ownerProperties.length,
    ownerTenants: ownerTenants.length,
    ownerRoommates: ownerRoommates.length
  });

  return {
    currentOwner,
    ownerProperties,
    ownerTenants,
    ownerRoommates,
    ownerContracts,
    loading,
    error
  };
};
