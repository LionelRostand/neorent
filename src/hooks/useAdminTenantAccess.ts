
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
    console.log('All tenant profiles:', allProfiles);
    return allProfiles;
  };

  const switchToTenantProfile = (tenantProfile: any) => {
    if (!isAuthorizedAdmin()) {
      console.error('Accès non autorisé');
      return false;
    }
    console.log('Switching to tenant profile:', tenantProfile);
    setSelectedTenantProfile(tenantProfile);
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
