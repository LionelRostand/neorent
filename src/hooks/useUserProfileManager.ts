
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  type: 'admin' | 'owner' | 'locataire' | 'colocataire';
}

export const useUserProfileManager = (user: User | null) => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'admin' | 'owner' | 'locataire' | 'colocataire'>('locataire');

  useEffect(() => {
    // Check if admin is impersonating
    const adminProfile = sessionStorage.getItem('adminSelectedProfile');
    if (adminProfile) {
      try {
        const profile = JSON.parse(adminProfile);
        setSelectedProfile(profile);
        // Map owner role to owner type for consistency
        const mappedType = profile.role === 'owner' ? 'owner' : profile.type;
        setUserType(mappedType);
      } catch (error) {
        console.error('Error parsing admin profile:', error);
      }
    } else if (user) {
      // Regular user profile - check if it's the admin email
      const isAdmin = user.email === 'admin@neotech-consulting.com';
      const displayName = isAdmin ? 'Lionel DJOSSA' : (user.displayName || user.email || '');
      
      const profile = {
        id: user.uid,
        name: displayName,
        email: user.email || '',
        role: isAdmin ? 'admin' : 'locataire',
        type: isAdmin ? 'admin' as const : 'locataire' as const
      };
      setSelectedProfile(profile);
      setUserType(isAdmin ? 'admin' : 'locataire');
    }
  }, [user]);

  const clearAdminImpersonation = () => {
    sessionStorage.removeItem('adminSelectedProfile');
    window.location.reload();
  };

  const setAdminImpersonation = (profile: UserProfile) => {
    sessionStorage.setItem('adminSelectedProfile', JSON.stringify(profile));
  };

  return {
    selectedProfile,
    userType,
    setUserType,
    clearAdminImpersonation,
    setAdminImpersonation
  };
};
