
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
    console.log('========================');
  }, [currentProfile, currentType, isImpersonating, isAuthorizedAdmin, userProfile, userType]);

  // Build property data using current profile information
  const mockPropertyData = currentProfile ? {
    title: `${currentType === 'colocataire' ? 'Chambre' : 'Appartement'} ${currentProfile.property || currentProfile.roomNumber || 'T2'}`,
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    type: currentType === 'colocataire' ? 'Chambre en colocation' : 'Appartement',
    surface: currentType === 'colocataire' ? '15 m²' : '45 m²',
    rooms: currentType === 'colocataire' ? '1 chambre' : '2 pièces',
    rent: currentProfile.rentAmount || 1200,
    charges: 150,
    deposit: (currentProfile.rentAmount || 1200) * 2,
    furnished: true,
    floor: "3ème étage",
    elevator: true,
    parking: false,
    features: currentType === 'colocataire' 
      ? ["Chambre meublée", "Cuisine partagée", "Salle de bain partagée", "Lumineux"]
      : ["Balcon", "Cuisine équipée", "Parquet", "Lumineux"]
  } : null;

  // Tenant/roommate data for components
  const mockTenantData = currentProfile ? {
    id: currentProfile.id || 1,
    name: currentProfile.name,
    email: currentProfile.email,
    phone: currentProfile.phone || "0123456789",
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    leaseStart: currentProfile.leaseStart || currentProfile.moveInDate || "2024-01-01",
    leaseEnd: currentProfile.leaseEnd || "2024-12-31",
    status: currentProfile.status || "À jour",
    type: (currentType === 'colocataire' ? 'Colocataire' : 'Locataire') as 'Colocataire' | 'Locataire',
    emergencyContact: {
      name: "Contact Urgence",
      phone: "0987654321",
      relation: "Famille"
    }
  } : null;

  console.log('Rendered data:', { mockPropertyData, mockTenantData });

  return {
    currentProfile,
    currentType,
    isAuthorizedAdmin,
    isImpersonating,
    switchBackToAdmin,
    mockPropertyData,
    mockTenantData
  };
};
