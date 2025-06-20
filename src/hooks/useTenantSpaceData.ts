
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAdminTenantAccess } from './useAdminTenantAccess';

export const useTenantSpaceData = () => {
  const { userProfile, userType } = useAuth();
  const { 
    isAuthorizedAdmin, 
    getCurrentProfile, 
    getCurrentUserType,
    switchBackToAdmin,
    isImpersonating 
  } = useAdminTenantAccess();

  const currentProfile = getCurrentProfile();
  const currentType = getCurrentUserType();

  // Debug logs
  useEffect(() => {
    console.log('=== TenantSpace Debug ===');
    console.log('Current profile:', currentProfile);
    console.log('Current type:', currentType);
    console.log('Is impersonating:', isImpersonating);
    console.log('Is admin:', isAuthorizedAdmin);
    console.log('User profile:', userProfile);
    console.log('User type:', userType);
    console.log('Profile name check:', currentProfile?.name);
    console.log('Profile room number check:', currentProfile?.roomNumber);
    console.log('========================');
  }, [currentProfile, currentType, isImpersonating, isAuthorizedAdmin, userProfile, userType]);

  // Build property data using current profile information
  const mockPropertyData = currentProfile ? {
    title: `${currentType === 'colocataire' ? 'Chambre' : 'Appartement'} ${currentProfile.property || currentProfile.roomNumber || 'T2'}`,
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    type: currentType === 'colocataire' ? 'Chambre en colocation' : 'Appartement',
    surface: currentType === 'colocataire' ? '15 m²' : '45 m²',
    rooms: currentType === 'colocataire' ? '1 chambre' : '2 pièces',
    rent: 400, // Corrigé: 400€ au lieu de 450€
    charges: 50,
    deposit: 450,
    furnished: true,
    floor: "1er étage",
    elevator: true,
    parking: false,
    features: currentType === 'colocataire' 
      ? ["Chambre meublée", "Cuisine partagée", "Salle de bain partagée", "Lumineux"]
      : ["Balcon", "Cuisine équipée", "Parquet", "Lumineux"]
  } : null;

  // Tenant/roommate data for components - FORCER les bonnes dates de bail
  const mockTenantData = currentProfile ? {
    id: currentProfile.id || 1,
    name: currentProfile.name?.trim() || 'Nom non disponible',
    email: currentProfile.email || 'Email non disponible',
    phone: currentProfile.phone || "0123456789",
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    leaseStart: "2025-01-06", // Date de début forcée
    leaseEnd: "2026-01-05",   // Date de fin forcée (exactement 1 an)
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
  console.log('Current profile for header:', {
    name: currentProfile?.name?.trim(),
    roomNumber: currentProfile?.roomNumber,
    type: currentType
  });

  return {
    currentProfile: currentProfile ? {
      ...currentProfile,
      name: currentProfile.name?.trim() || 'Nom non disponible',
      roomNumber: currentProfile.roomNumber || null
    } : null,
    currentType,
    isAuthorizedAdmin,
    isImpersonating,
    switchBackToAdmin,
    mockPropertyData,
    mockTenantData
  };
};
