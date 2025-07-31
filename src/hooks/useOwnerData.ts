
import { useMemo } from 'react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { useFirebaseCharges } from '@/hooks/useFirebaseCharges';
import { useAuth } from '@/hooks/useAuth';

export const useOwnerData = (ownerProfile: any) => {
  const { userType } = useAuth();
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

    // Si c'est l'admin, retourner toutes les données
    if (userType === 'admin') {
      const propertyTitles = properties.map(p => p.title);
      return {
        properties: properties,
        roommates: roommates,
        tenants: tenants,
        payments: payments,
        contracts: contracts,
        inspections: inspections,
        charges: charges,
        propertyTitles: propertyTitles
      };
    }

    // Pour les propriétaires, filtrer seulement leurs données avec vérifications strictes
    const ownerProperties = properties.filter(property => {
      const isOwnerByName = property.owner === ownerProfile.name;
      const isOwnerByEmail = property.owner === ownerProfile.email;
      
      console.log('Property filter check:', {
        propertyTitle: property.title,
        propertyOwner: property.owner,
        profileName: ownerProfile.name,
        profileEmail: ownerProfile.email,
        matches: { isOwnerByName, isOwnerByEmail }
      });
      
      return isOwnerByName || isOwnerByEmail;
    });

    // Obtenir les titres des propriétés pour filtrer les autres données
    const propertyTitles = ownerProperties.map(p => p.title);

    // Filtrer toutes les données selon les propriétés du propriétaire strictement
    const ownerRoommates = roommates.filter(roommate => 
      propertyTitles.includes(roommate.property)
    );

    const ownerTenants = tenants.filter(tenant => 
      propertyTitles.includes(tenant.property)
    );

    const ownerPayments = payments.filter(payment => 
      propertyTitles.includes(payment.property)
    );

    const ownerContracts = contracts.filter(contract => 
      propertyTitles.includes(contract.property)
    );

    const ownerInspections = inspections.filter(inspection => 
      propertyTitles.includes(inspection.property)
    );

    const ownerCharges = charges.filter(charge => 
      propertyTitles.includes(charge.propertyName)
    );

    console.log('Owner data filtered for:', ownerProfile.name, {
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
  }, [ownerProfile, properties, roommates, tenants, payments, contracts, inspections, charges, userType]);

  return ownerData;
};
