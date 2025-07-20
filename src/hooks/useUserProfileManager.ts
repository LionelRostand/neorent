
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
      
      // Check for specific roommate profile
      const isEmadAdam = user.email === 'entrepreneurpro19@gmail.com';
      
      let profile: UserProfile;
      
      if (isAdmin) {
        profile = {
          id: user.uid,
          name: 'Lionel DJOSSA',
          email: user.email || '',
          role: 'admin',
          type: 'admin' as const
        };
      } else if (isEmadAdam) {
        // Profile spécifique pour Emad ADAM
        profile = {
          id: '1752971742586',
          name: 'Emad ADAM',
          email: user.email || '',
          role: 'colocataire',
          type: 'colocataire' as const
        };
      } else {
        // Default profile for other users
        profile = {
          id: user.uid,
          name: user.displayName || user.email || '',
          email: user.email || '',
          role: 'locataire',
          type: 'locataire' as const
        };
      } 
      
      setSelectedProfile(profile);
      setUserType(profile.type);
      
      console.log('Setting user profile:', profile);
      console.log('Setting user type:', profile.type);
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
