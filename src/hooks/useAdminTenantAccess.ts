
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

export const useAdminTenantAccess = () => {
  const { user, userProfile } = useAuth();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const [selectedTenantProfile, setSelectedTenantProfile] = useState(null);

  const isAuthorizedAdmin = () => {
    return user?.email === 'admin@neotech-consulting.com';
  };

  const getAllTenantProfiles = () => {
    const allProfiles = [
      ...tenants.map(t => ({ 
        ...t, 
        type: 'locataire',
        address: t.property || "Adresse non spécifiée",
        rentAmount: Number(t.rentAmount) || 0,
        leaseStart: t.leaseStart || new Date().toISOString().split('T')[0],
        leaseEnd: t.nextPayment || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      })),
      ...roommates.map(r => ({ 
        ...r, 
        type: 'colocataire',
        address: r.property || "Adresse non spécifiée",
        rentAmount: Number(r.rentAmount) || 0,
        leaseStart: r.moveInDate || new Date().toISOString().split('T')[0],
        leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      }))
    ];
    console.log('All tenant profiles with enhanced data:', allProfiles);
    return allProfiles;
  };

  const switchToTenantProfile = (tenantProfile: any) => {
    if (!isAuthorizedAdmin()) {
      console.error('Accès non autorisé');
      return false;
    }
    console.log('Switching to tenant profile:', tenantProfile);
    
    // Enrichir le profil avec toutes les données nécessaires
    const enrichedProfile = {
      ...tenantProfile,
      address: tenantProfile.address || tenantProfile.property || "Adresse non spécifiée",
      rentAmount: Number(tenantProfile.rentAmount) || 0,
      leaseStart: tenantProfile.leaseStart || tenantProfile.moveInDate || new Date().toISOString().split('T')[0],
      leaseEnd: tenantProfile.leaseEnd || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      phone: tenantProfile.phone || "Non spécifié",
      status: tenantProfile.status || "Actif"
    };
    
    setSelectedTenantProfile(enrichedProfile);
    console.log('Enhanced profile set:', enrichedProfile);
    return true;
  };

  const switchBackToAdmin = () => {
    console.log('Switching back to admin');
    setSelectedTenantProfile(null);
  };

  const getCurrentProfile = () => {
    if (selectedTenantProfile && isAuthorizedAdmin()) {
      console.log('Returning selected profile:', selectedTenantProfile);
      return selectedTenantProfile;
    }
    console.log('Returning user profile:', userProfile);
    return userProfile;
  };

  const getCurrentUserType = () => {
    if (selectedTenantProfile && isAuthorizedAdmin()) {
      console.log('Returning selected type:', selectedTenantProfile.type);
      return selectedTenantProfile.type;
    }
    const type = user?.email === 'admin@neotech-consulting.com' ? 'admin' : userProfile?.role || 'locataire';
    console.log('Returning user type:', type);
    return type;
  };

  return {
    isAuthorizedAdmin: isAuthorizedAdmin(),
    getAllTenantProfiles,
    switchToTenantProfile,
    switchBackToAdmin,
    getCurrentProfile,
    getCurrentUserType,
    selectedTenantProfile,
    isImpersonating: !!selectedTenantProfile
  };
};
