
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  type: 'admin' | 'owner' | 'locataire' | 'colocataire';
  isOwner?: boolean;
}

export const useUserProfileManager = (user: User | null) => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'admin' | 'owner' | 'locataire' | 'colocataire'>('owner');
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();

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
      // Check if it's the admin email
      const isAdmin = user.email === 'admin@neotech-consulting.com';
      
      if (isAdmin) {
        const profile = {
          id: user.uid,
          name: 'Lionel DJOSSA',
          email: user.email || '',
          role: 'admin',
          type: 'admin' as const,
          isOwner: true // Admin a les droits de propriétaire
        } as UserProfile;
        
        setSelectedProfile(profile);
        setUserType('admin');
      } else {
        // Check if user is a tenant
        const tenant = tenants.find(t => t.email === user.email);
        if (tenant) {
          const profile = {
            id: user.uid,
            name: tenant.name,
            email: user.email || '',
            role: 'locataire',
            type: 'locataire' as const
          } as UserProfile;
          
          setSelectedProfile(profile);
          setUserType('locataire');
          return;
        }

        // Check if user is a roommate
        const roommate = roommates.find(r => r.email === user.email);
        if (roommate) {
          const profile = {
            id: user.uid,
            name: roommate.name,
            email: user.email || '',
            role: 'colocataire',
            type: 'colocataire' as const
          } as UserProfile;
          
          setSelectedProfile(profile);
          setUserType('colocataire');
          return;
        }

        // Si l'utilisateur n'est ni locataire ni colocataire, c'est un propriétaire
        // Créer un profil propriétaire par défaut
        console.log('🏠 Création profil propriétaire pour:', user.email);
        const profile = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Propriétaire',
          email: user.email || '',
          role: 'owner',
          type: 'owner' as const,
          isOwner: true
        } as UserProfile;
        
        setSelectedProfile(profile);
        setUserType('owner');
      }
      
      console.log('Setting user profile:', selectedProfile);
      console.log('Setting user type:', userType);
    }
  }, [user, tenants, roommates]);

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
