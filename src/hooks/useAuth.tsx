
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: any | null;
  userType: 'locataire' | 'colocataire' | 'admin' | 'employee' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userType, setUserType] = useState<'locataire' | 'colocataire' | 'admin' | 'employee' | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Only initialize Firebase hooks after component mounts
  const [hooksInitialized, setHooksInitialized] = useState(false);
  
  // Initialize hooks conditionally
  const { tenants } = hooksInitialized ? useFirebaseTenants() : { tenants: [] };
  const { roommates } = hooksInitialized ? useFirebaseRoommates() : { roommates: [] };
  const { getUserRole, userRoles } = hooksInitialized ? useFirebaseUserRoles() : { getUserRole: async () => null, userRoles: [] };

  // Initialize hooks after mount
  useEffect(() => {
    setHooksInitialized(true);
  }, []);

  // Vérifier si l'utilisateur existe dans Firebase
  const checkUserProfile = async (currentUser: User | null) => {
    if (!currentUser || !hooksInitialized) {
      setUserProfile(null);
      setUserType(null);
      return;
    }

    console.log('🔍 Vérification du profil pour:', currentUser.email);

    try {
      // D'abord vérifier dans user_roles par UID (admin/employee)
      let userRole = await getUserRole(currentUser.uid);
      
      // Si pas trouvé par UID, chercher par email
      if (!userRole && userRoles.length > 0) {
        console.log('🔍 Recherche par email dans user_roles...');
        userRole = userRoles.find(role => role.email === currentUser.email);
        console.log('📧 Résultat recherche par email:', userRole);
      }
      
      if (userRole) {
        console.log('👤 Profil admin/employé trouvé:', userRole);
        setUserProfile({
          id: userRole.id,
          name: userRole.name,
          email: userRole.email,
          role: userRole.role,
          permissions: userRole.permissions || [],
          hasPassword: userRole.hasPassword || false
        });
        setUserType(userRole.role);
        return;
      }

      // Attendre que les données tenants/roommates soient chargées
      if (!dataLoaded) {
        console.log('⏳ Données pas encore chargées, attente...');
        return;
      }

      // Chercher dans les locataires
      const tenantProfile = tenants.find(t => t.email === currentUser.email);
      if (tenantProfile) {
        console.log('🏠 Profil locataire trouvé:', tenantProfile);
        setUserProfile(tenantProfile);
        setUserType('locataire');
        return;
      }

      // Chercher dans les colocataires
      const roommateProfile = roommates.find(r => r.email === currentUser.email);
      if (roommateProfile) {
        console.log('👥 Profil colocataire trouvé:', roommateProfile);
        setUserProfile(roommateProfile);
        setUserType('colocataire');
        return;
      }

      // Si aucun profil trouvé après chargement des données
      console.log('❌ Aucun profil trouvé pour:', currentUser.email);
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du profil:', error);
      setUserProfile(null);
      setUserType(null);
    }
  };

  // Surveiller les changements d'authentification
  useEffect(() => {
    console.log('🔐 Initialisation de l\'écoute auth...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser?.email || 'déconnecté');
      setUser(firebaseUser);
      
      if (firebaseUser && hooksInitialized) {
        // Utilisateur connecté, vérifier son profil
        await checkUserProfile(firebaseUser);
      } else {
        // Utilisateur déconnecté
        setUserProfile(null);
        setUserType(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [hooksInitialized]);

  // Marquer les données comme chargées et vérifier le profil
  useEffect(() => {
    if (!hooksInitialized) return;
    
    // Considérer les données comme chargées même si les listes sont vides
    // pour éviter d'attendre indéfiniment
    if (!dataLoaded) {
      const timer = setTimeout(() => {
        console.log('📊 Données Firebase marquées comme chargées:', { 
          tenants: tenants.length, 
          roommates: roommates.length,
          userRoles: userRoles.length 
        });
        setDataLoaded(true);
        
        // Si un utilisateur est connecté, vérifier son profil avec les données disponibles
        if (user && !userProfile) {
          console.log('🔄 Re-vérification du profil avec données disponibles...');
          checkUserProfile(user);
        }
      }, 2000); // Attendre 2 secondes max pour charger les données

      return () => clearTimeout(timer);
    }
  }, [tenants, roommates, userRoles, user, userProfile, dataLoaded, hooksInitialized]);

  // Re-vérifier le profil quand les données changent
  useEffect(() => {
    if (dataLoaded && user && !userProfile && hooksInitialized) {
      console.log('🔄 Nouvelles données disponibles, re-vérification du profil...');
      checkUserProfile(user);
    }
  }, [tenants, roommates, userRoles, dataLoaded, user, userProfile, hooksInitialized]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setUserType(null);
    setDataLoaded(false);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
