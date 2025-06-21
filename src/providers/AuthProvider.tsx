
import React, { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserProfileManager } from '@/hooks/useUserProfileManager';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hooksInitialized, setHooksInitialized] = useState(false);
  
  const { userProfile, userType, checkUserProfile, resetProfile } = useUserProfileManager(user, hooksInitialized);

  useEffect(() => {
    setHooksInitialized(true);
  }, []);

  // Surveiller les changements d'authentification
  useEffect(() => {
    console.log('🔐 Initialisation de l\'écoute auth...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser?.email || 'déconnecté');
      setUser(firebaseUser);
      
      if (firebaseUser && hooksInitialized) {
        await checkUserProfile(firebaseUser);
      } else {
        resetProfile();
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [hooksInitialized, checkUserProfile, resetProfile]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    resetProfile();
  };

  const value = {
    user,
    loading,
    userProfile,
    userType,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
