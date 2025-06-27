
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

export const useAdminTenantAccess = () => {
  const { user, userProfile } = useAuth();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const [selectedTenantProfile, setSelectedTenantProfile] = useState(() => {
    // Restore from sessionStorage on initialization
    const stored = sessionStorage.getItem('adminSelectedProfile');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist selected profile to sessionStorage
  useEffect(() => {
    if (selectedTenantProfile) {
      sessionStorage.setItem('adminSelectedProfile', JSON.stringify(selectedTenantProfile));
      console.log('Persisted selected profile to storage:', selectedTenantProfile);
    } else {
      sessionStorage.removeItem('adminSelectedProfile');
      console.log('Removed selected profile from storage');
    }
  }, [selectedTenantProfile]);

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
    console.log('Available tenant profiles:', allProfiles);
    return allProfiles;
  };

  const switchToTenantProfile = (tenantProfile: any) => {
    if (!isAuthorizedAdmin()) {
      console.error('Accès non autorisé - utilisateur non admin');
      return false;
    }
    
    console.log('Switching to tenant profile:', tenantProfile);
    
    // Enrichir le profil avec toutes les données nécessaires
    const enrichedProfile = {
      ...tenantProfile,
      id: tenantProfile.id,
      name: tenantProfile.name,
      email: tenantProfile.email,
      address: tenantProfile.address || tenantProfile.property || "Adresse non spécifiée",
      rentAmount: Number(tenantProfile.rentAmount) || 0,
      leaseStart: tenantProfile.leaseStart || tenantProfile.moveInDate || new Date().toISOString().split('T')[0],
      leaseEnd: tenantProfile.leaseEnd || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      phone: tenantProfile.phone || "Non spécifié",
      status: tenantProfile.status || "Actif",
      type: tenantProfile.type,
      // For roommates
      roomNumber: tenantProfile.roomNumber || null,
      primaryTenant: tenantProfile.primaryTenant || null,
      moveInDate: tenantProfile.moveInDate || null,
      // For tenants
      property: tenantProfile.property || null,
      nextPayment: tenantProfile.nextPayment || null,
      // For owners/employees
      role: tenantProfile.role || null,
      companyId: tenantProfile.companyId || null,
      permissions: tenantProfile.permissions || null
    };
    
    console.log('Setting enriched profile:', enrichedProfile);
    setSelectedTenantProfile(enrichedProfile);
    return true;
  };

  const switchBackToAdmin = () => {
    console.log('Switching back to admin - clearing selected profile');
    setSelectedTenantProfile(null);
  };

  const getCurrentProfile = () => {
    if (selectedTenantProfile && isAuthorizedAdmin()) {
      console.log('Returning selected admin profile:', selectedTenantProfile);
      return selectedTenantProfile;
    }
    
    // Si pas de profil sélectionné, retourner le profil utilisateur ou créer un profil par défaut
    const profile = userProfile || {
      id: user?.uid || '1',
      name: user?.email === 'admin@neotech-consulting.com' ? 'Lionel DJOSSA' : (user?.displayName || user?.email || 'Utilisateur'),
      email: user?.email || 'Non spécifié',
      role: user?.email === 'admin@neotech-consulting.com' ? 'admin' : 'owner',
      type: user?.email === 'admin@neotech-consulting.com' ? 'admin' : 'owner'
    };
    
    console.log('Returning user profile:', profile);
    return profile;
  };

  const getCurrentUserType = () => {
    if (selectedTenantProfile && isAuthorizedAdmin()) {
      console.log('Returning selected profile type:', selectedTenantProfile.type);
      return selectedTenantProfile.type;
    }
    const type = user?.email === 'admin@neotech-consulting.com' ? 'admin' : userProfile?.role || 'owner';
    console.log('Returning user type:', type);
    return type;
  };

  // Debug current state
  useEffect(() => {
    console.log('Admin tenant access state:', {
      isAuthorizedAdmin: isAuthorizedAdmin(),
      selectedTenantProfile,
      currentProfile: getCurrentProfile(),
      currentUserType: getCurrentUserType(),
      isImpersonating: !!selectedTenantProfile
    });
  }, [selectedTenantProfile, user, userProfile]);

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
