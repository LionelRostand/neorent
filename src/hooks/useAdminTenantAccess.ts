
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
      ...tenants.map(t => ({ ...t, type: 'locataire' })),
      ...roommates.map(r => ({ ...r, type: 'colocataire' }))
    ];
    return allProfiles;
  };

  const switchToTenantProfile = (tenantProfile: any) => {
    if (!isAuthorizedAdmin()) {
      console.error('Accès non autorisé');
      return false;
    }
    setSelectedTenantProfile(tenantProfile);
    return true;
  };

  const switchBackToAdmin = () => {
    setSelectedTenantProfile(null);
  };

  const getCurrentProfile = () => {
    if (selectedTenantProfile && isAuthorizedAdmin()) {
      return selectedTenantProfile;
    }
    return userProfile;
  };

  const getCurrentUserType = () => {
    if (selectedTenantProfile && isAuthorizedAdmin()) {
      return selectedTenantProfile.type;
    }
    return user?.email === 'admin@neotech-consulting.com' ? 'admin' : userProfile?.role || 'locataire';
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
