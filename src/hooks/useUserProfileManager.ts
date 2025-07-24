
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
    console.log('🔄 useUserProfileManager - User changed:', user?.email);
    
    // Clear any old data first
    sessionStorage.removeItem('adminSelectedProfile');
    
    // Check if admin is impersonating
    const adminProfile = sessionStorage.getItem('adminSelectedProfile');
    console.log('🔍 Admin profile in storage:', adminProfile);
    if (adminProfile) {
      try {
        const profile = JSON.parse(adminProfile);
        console.log('👤 Admin impersonation detected:', profile);
        setSelectedProfile(profile);
        // Map owner role to owner type for consistency
        const mappedType = profile.role === 'owner' ? 'owner' : profile.type;
        setUserType(mappedType);
      } catch (error) {
        console.error('Error parsing admin profile:', error);
      }
    } else if (user) {
      // Regular user profile - check specific cases
      const isAdmin = user.email === 'admin@neotech-consulting.com';
      const isEmadAdam = user.email === 'entrepreneurpro19@gmail.com';
      const isRuthMegha = user.email === 'ruthmegha35@gmail.com';
      
      console.log('🔍 User type checks:', { isAdmin, isEmadAdam, isRuthMegha, email: user.email });
      
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
        console.log('✅ Profile Emad ADAM créé:', profile);
      } else if (isRuthMegha) {
        // Profile spécifique pour Ruth MEGHA
        profile = {
          id: '1752971742587',
          name: 'Ruth MEGHA',
          email: user.email || '',
          role: 'colocataire',
          type: 'colocataire' as const
        };
        console.log('✅ Profile Ruth MEGHA créé:', profile);
      } else {
        // Default profile for other users
        profile = {
          id: user.uid,
          name: user.displayName || user.email || '',
          email: user.email || '',
          role: 'locataire',
          type: 'locataire' as const
        };
        console.log('✅ Profile par défaut créé pour:', user.email, profile);
      }
      
      setSelectedProfile(profile);
      setUserType(profile.type);
      
      console.log('🔄 Setting user profile for:', user.email, profile);
      console.log('🔄 Setting user type:', profile.type);
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
