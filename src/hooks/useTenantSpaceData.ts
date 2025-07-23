
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAdminTenantAccess } from './useAdminTenantAccess';
import { useFirebaseContracts } from './useFirebaseContracts';
import { useRoommateData } from './useRoommateData';

export const useTenantSpaceData = () => {
  const { userProfile, userType, user } = useAuth();
  const { 
    isAuthorizedAdmin, 
    getCurrentProfile, 
    getCurrentUserType,
    switchBackToAdmin,
    isImpersonating 
  } = useAdminTenantAccess();
  const { contracts } = useFirebaseContracts();
  const { roommateProfile } = useRoommateData(user?.email || null);

  // Priorité au profil colocataire si il existe
  const currentProfile = roommateProfile || getCurrentProfile();
  // Priorité au type colocataire si le profil colocataire existe
  const currentType = roommateProfile ? 'colocataire' : getCurrentUserType();

  // Trouver le contrat signé pour le locataire/colocataire actuel
  const signedContract = contracts.find(contract => 
    contract.status === 'Signé' && 
    contract.tenant === currentProfile?.name
  );

  // Pour Emad ADAM, créer un contrat fictif s'il n'existe pas
  const mockSignedContract = currentProfile?.email === 'entrepreneurpro19@gmail.com' ? {
    id: 'contract-emad-adam',
    title: 'Contrat de Colocation',
    type: 'Colocation',
    tenant: 'Emad ADAM',
    property: 'Appartement 13',
    amount: `${currentProfile.rentAmount || 580}€/mois`,
    startDate: '2025-03-03',
    endDate: '2026-07-20',
    status: 'Signé',
    jurisdiction: 'francaise',
    provider: 'Gestionnaire',
    signatures: {}
  } : null;

  const activeContract = signedContract || mockSignedContract;

  // Utiliser le montant réel du profil colocataire
  const profileRentAmount = currentProfile?.rentAmount ? 
    parseInt(currentProfile.rentAmount.toString()) : 
    (currentType === 'colocataire' ? 580 : 400);

  const contractTotalAmount = activeContract ? 
    parseInt(activeContract.amount.replace(/[€\/mois]/g, '')) : 
    profileRentAmount;

  // Pour les colocataires : 580€ total = 530€ loyer + 50€ charges
  const charges = 50;
  const baseRent = contractTotalAmount - charges;

  // Debug logs
  useEffect(() => {
    console.log('=== TenantSpace Debug ===');
    console.log('User email:', user?.email);
    console.log('Roommate profile:', roommateProfile);
    console.log('getCurrentProfile():', getCurrentProfile());
    console.log('Current profile (final):', currentProfile);
    console.log('Current type (final):', currentType);
    console.log('Signed contract:', activeContract);
    console.log('Contract total amount:', contractTotalAmount);
    console.log('Base rent:', baseRent);
    console.log('Charges:', charges);
    console.log('Is impersonating:', isImpersonating);
    console.log('Is admin:', isAuthorizedAdmin);
    console.log('========================');
  }, [currentProfile, currentType, isImpersonating, isAuthorizedAdmin, userProfile, userType, activeContract, user?.email, roommateProfile]);

  // Build property data using current profile information and contract data
  const mockPropertyData = currentProfile ? {
    title: `${currentType === 'colocataire' ? currentProfile.roomNumber || 'Chambre 3' : 'Appartement'} ${currentProfile.property || 'T2'}`,
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    type: currentType === 'colocataire' ? 'Chambre en colocation' : 'Appartement',
    surface: currentType === 'colocataire' ? '15 m²' : '45 m²',
    rooms: currentType === 'colocataire' ? '1 chambre' : '2 pièces',
    rent: baseRent, // Loyer de base sans les charges
    charges: charges, // Charges séparées
    deposit: contractTotalAmount, // Caution = loyer total
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
    leaseStart: activeContract?.startDate || currentProfile.leaseStart || "2025-01-06",
    leaseEnd: activeContract?.endDate || currentProfile.leaseEnd || "2026-01-05",
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
    signedContract: activeContract
  };
};
