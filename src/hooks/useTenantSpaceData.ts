
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAdminTenantAccess } from './useAdminTenantAccess';
import { useFirebaseContracts } from './useFirebaseContracts';

export const useTenantSpaceData = () => {
  const { userProfile, userType } = useAuth();
  const { 
    isAuthorizedAdmin, 
    getCurrentProfile, 
    getCurrentUserType,
    switchBackToAdmin,
    isImpersonating 
  } = useAdminTenantAccess();
  const { contracts } = useFirebaseContracts();

  const currentProfile = getCurrentProfile();
  const currentType = getCurrentUserType();

  // Trouver le contrat signé pour le locataire/colocataire actuel
  const signedContract = contracts.find(contract => 
    contract.status === 'Signé' && 
    contract.tenant === currentProfile?.name
  );

  // Extraire le montant du contrat (enlever le €/mois et convertir en nombre)
  const contractRentAmount = signedContract ? 
    parseInt(signedContract.amount.replace(/[€\/mois]/g, '')) : 
    (currentType === 'colocataire' ? 450 : 400);

  // Debug logs
  useEffect(() => {
    console.log('=== TenantSpace Debug ===');
    console.log('Current profile:', currentProfile);
    console.log('Current type:', currentType);
    console.log('Signed contract:', signedContract);
    console.log('Contract rent amount:', contractRentAmount);
    console.log('Is impersonating:', isImpersonating);
    console.log('Is admin:', isAuthorizedAdmin);
    console.log('========================');
  }, [currentProfile, currentType, isImpersonating, isAuthorizedAdmin, userProfile, userType, signedContract]);

  // Build property data using current profile information and contract data
  const mockPropertyData = currentProfile ? {
    title: `${currentType === 'colocataire' ? 'Chambre' : 'Appartement'} ${currentProfile.property || currentProfile.roomNumber || 'T2'}`,
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    type: currentType === 'colocataire' ? 'Chambre en colocation' : 'Appartement',
    surface: currentType === 'colocataire' ? '15 m²' : '45 m²',
    rooms: currentType === 'colocataire' ? '1 chambre' : '2 pièces',
    rent: contractRentAmount, // Utiliser le montant du contrat
    charges: 50,
    deposit: contractRentAmount + 50, // Caution = loyer + charges
    furnished: true,
    floor: "1er étage",
    elevator: true,
    parking: false,
    features: currentType === 'colocataire' 
      ? ["Chambre meublée", "Cuisine partagée", "Salle de bain partagée", "Lumineux"]
      : ["Balcon", "Cuisine équipée", "Parquet", "Lumineux"]
  } : null;

  // Tenant/roommate data for components
  const mockTenantData = currentProfile ? {
    id: currentProfile.id || 1,
    name: currentProfile.name?.trim() || 'Nom non disponible',
    email: currentProfile.email || 'Email non disponible',
    phone: currentProfile.phone || "0123456789",
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    leaseStart: signedContract?.startDate || "2025-01-06",
    leaseEnd: signedContract?.endDate || "2026-01-05",
    status: currentProfile.status || "À jour",
    type: (currentType === 'colocataire' ? 'Colocataire' : 'Locataire') as 'Colocataire' | 'Locataire',
    roomNumber: currentProfile.roomNumber || null,
    emergencyContact: {
      name: "Contact Urgence",
      phone: "0987654321",
      relation: "Famille"
    }
  } : null;

  console.log('Rendered data:', { mockPropertyData, mockTenantData });

  // Fix the null reference error by properly checking currentProfile before accessing properties
  const safeCurrentProfile = currentProfile ? {
    ...currentProfile,
    name: currentProfile.name?.trim() || 'Nom non disponible',
    roomNumber: currentProfile.roomNumber || null
  } : null;

  return {
    currentProfile: safeCurrentProfile,
    currentType,
    isAuthorizedAdmin,
    isImpersonating,
    switchBackToAdmin,
    mockPropertyData,
    mockTenantData,
    signedContract
  };
};
