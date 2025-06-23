
import { useMemo } from 'react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { useFirebaseCharges } from '@/hooks/useFirebaseCharges';

export const useOwnerData = (ownerProfile: any) => {
  const { properties } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();
  const { tenants } = useFirebaseTenants();
  const { payments } = useFirebasePayments();
  const { contracts } = useFirebaseContracts();
  const { inspections } = useFirebaseInspections();
  const { charges } = useFirebaseCharges();

  const ownerData = useMemo(() => {
    if (!ownerProfile) {
      return {
        properties: [],
        roommates: [],
        tenants: [],
        payments: [],
        contracts: [],
        inspections: [],
        charges: [],
        propertyTitles: []
      };
    }

    // Filtrer les propriétés du propriétaire connecté
    const ownerProperties = properties.filter(property => 
      property.owner === ownerProfile.name || 
      property.owner === ownerProfile.email ||
      property.ownerId === ownerProfile.id
    );

    // Obtenir les titres des propriétés pour filtrer les autres données
    const propertyTitles = ownerProperties.map(p => p.title);

    // Filtrer les colocataires selon les propriétés du propriétaire
    const ownerRoommates = roommates.filter(roommate => 
      propertyTitles.includes(roommate.property)
    );

    // Filtrer les locataires selon les propriétés du propriétaire
    const ownerTenants = tenants.filter(tenant => 
      propertyTitles.includes(tenant.property)
    );

    // Filtrer les paiements selon les propriétés du propriétaire
    const ownerPayments = payments.filter(payment => 
      propertyTitles.includes(payment.property)
    );

    // Filtrer les contrats selon les propriétés du propriétaire
    const ownerContracts = contracts.filter(contract => 
      propertyTitles.includes(contract.property)
    );

    // Filtrer les inspections selon les propriétés du propriétaire
    const ownerInspections = inspections.filter(inspection => 
      propertyTitles.includes(inspection.property)
    );

    // Filtrer les charges selon les propriétés du propriétaire
    const ownerCharges = charges.filter(charge => 
      propertyTitles.includes(charge.propertyName)
    );

    console.log('Owner data filtered:', {
      ownerProfile: ownerProfile.name,
      properties: ownerProperties.length,
      roommates: ownerRoommates.length,
      tenants: ownerTenants.length,
      payments: ownerPayments.length,
      contracts: ownerContracts.length,
      inspections: ownerInspections.length,
      charges: ownerCharges.length
    });

    return {
      properties: ownerProperties,
      roommates: ownerRoommates,
      tenants: ownerTenants,
      payments: ownerPayments,
      contracts: ownerContracts,
      inspections: ownerInspections,
      charges: ownerCharges,
      propertyTitles
    };
  }, [ownerProfile, properties, roommates, tenants, payments, contracts, inspections, charges]);

  return ownerData;
};
