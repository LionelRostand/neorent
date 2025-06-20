
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';

export const useAdminOwnerAccess = () => {
  const { user, userProfile } = useAuth();
  const { userRoles } = useFirebaseUserRoles();
  const [selectedOwnerProfile, setSelectedOwnerProfile] = useState(() => {
    // Restore from sessionStorage on initialization
    const stored = sessionStorage.getItem('adminSelectedOwnerProfile');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist selected profile to sessionStorage
  useEffect(() => {
    if (selectedOwnerProfile) {
      sessionStorage.setItem('adminSelectedOwnerProfile', JSON.stringify(selectedOwnerProfile));
      console.log('Persisted selected owner profile to storage:', selectedOwnerProfile);
    } else {
      sessionStorage.removeItem('adminSelectedOwnerProfile');
      console.log('Removed selected owner profile from storage');
    }
  }, [selectedOwnerProfile]);

  const isAuthorizedAdmin = () => {
    return user?.email === 'admin@neotech-consulting.com';
  };

  const getAllOwnerProfiles = () => {
    // Filter only employee/owner roles
    const ownerProfiles = userRoles.filter(role => role.role === 'employee').map(owner => ({
      ...owner,
      type: 'employee',
      address: "Bureau principal", // Default address for owners
      role: 'Propriétaire'
    }));
    console.log('Available owner profiles:', ownerProfiles);
    return ownerProfiles;
  };

  const switchToOwnerProfile = (ownerProfile: any) => {
    if (!isAuthorizedAdmin()) {
      console.error('Accès non autorisé - utilisateur non admin');
      return false;
    }
    
    console.log('Switching to owner profile:', ownerProfile);
    
    // Enrichir le profil avec toutes les données nécessaires
    const enrichedProfile = {
      ...ownerProfile,
      id: ownerProfile.id,
      name: ownerProfile.name,
      email: ownerProfile.email,
      role: ownerProfile.role,
      permissions: ownerProfile.permissions || [],
      type: 'employee',
      address: ownerProfile.address || "Bureau principal"
    };
    
    console.log('Setting enriched owner profile:', enrichedProfile);
    setSelectedOwnerProfile(enrichedProfile);
    return true;
  };

  const switchBackToAdmin = () => {
    console.log('Switching back to admin - clearing selected owner profile');
    setSelectedOwnerProfile(null);
  };

  const getCurrentProfile = () => {
    if (selectedOwnerProfile && isAuthorizedAdmin()) {
      console.log('Returning selected admin owner profile:', selectedOwnerProfile);
      return selectedOwnerProfile;
    }
    console.log('Returning user profile:', userProfile);
    return userProfile;
  };

  const getCurrentUserType = () => {
    if (selectedOwnerProfile && isAuthorizedAdmin()) {
      console.log('Returning selected profile type:', selectedOwnerProfile.type);
      return selectedOwnerProfile.type;
    }
    const type = user?.email === 'admin@neotech-consulting.com' ? 'admin' : userProfile?.role || 'employee';
    console.log('Returning user type:', type);
    return type;
  };

  // Debug current state
  useEffect(() => {
    console.log('Admin owner access state:', {
      isAuthorizedAdmin: isAuthorizedAdmin(),
      selectedOwnerProfile,
      currentProfile: getCurrentProfile(),
      currentUserType: getCurrentUserType(),
      isImpersonating: !!selectedOwnerProfile
    });
  }, [selectedOwnerProfile, user, userProfile]);

  return {
    isAuthorizedAdmin: isAuthorizedAdmin(),
    getAllOwnerProfiles,
    switchToOwnerProfile,
    switchBackToAdmin,
    getCurrentProfile,
    getCurrentUserType,
    selectedOwnerProfile,
    isImpersonating: !!selectedOwnerProfile
  };
};
