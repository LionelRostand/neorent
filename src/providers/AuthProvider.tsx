
import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserProfileManager } from '@/hooks/useUserProfileManager';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { selectedProfile, userType } = useUserProfileManager(user);

  // Surveiller les changements d'authentification
  useEffect(() => {
    console.log('🔐 Initialisation de l\'écoute auth...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser?.email || 'déconnecté');
      setUser(firebaseUser);
      setLoading(false);
      
      // Redirection automatique après connexion
      if (firebaseUser && selectedProfile) {
        const isAdmin = firebaseUser.email === 'admin@neotech-consulting.com';
        
        if (isAdmin) {
          // Rediriger l'admin vers l'interface admin
          console.log('🔐 Admin connecté, redirection vers /admin');
          window.location.href = '/admin';
        } else if (userType === 'owner') {
          // Rediriger le propriétaire vers son espace personnalisé
          const ownerName = selectedProfile?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'owner';
          const cleanName = ownerName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
          const ownerSpaceUrl = `/owner-space-${cleanName}`;
          console.log('🔐 Propriétaire connecté, redirection vers:', ownerSpaceUrl);
          window.location.href = ownerSpaceUrl;
        } else if (userType === 'locataire' || userType === 'colocataire') {
          // Rediriger les locataires vers leur espace
          console.log('🔐 Locataire/Colocataire connecté, redirection vers /tenant-space');
          window.location.href = '/tenant-space';
        }
      }
    });

    return unsubscribe;
  }, [selectedProfile, userType]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    // Rediriger vers la page de connexion après déconnexion
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    userProfile: selectedProfile,
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
