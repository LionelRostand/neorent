
import { useState, useEffect, createContext, useContext } from 'react';
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
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { getUserRole } = useFirebaseUserRoles();

  // Vérifier si l'utilisateur existe dans Firebase
  const checkUserProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setUserProfile(null);
      setUserType(null);
      return;
    }

    console.log('🔍 Vérification du profil pour:', currentUser.email);

    try {
      // D'abord vérifier dans user_roles (admin/employee)
      const userRole = await getUserRole(currentUser.uid);
      if (userRole) {
        console.log('👤 Profil admin/employé trouvé:', userRole);
        setUserProfile({
          id: userRole.id,
          name: userRole.name,
          email: userRole.email,
          role: userRole.role,
          permissions: userRole.permissions || []
        });
        setUserType(userRole.role);
        return;
      }

      // Chercher dans les locataires (seulement si les données sont chargées)
      if (tenants.length > 0) {
        const tenantProfile = tenants.find(t => t.email === currentUser.email);
        if (tenantProfile) {
          console.log('🏠 Profil locataire trouvé:', tenantProfile);
          setUserProfile(tenantProfile);
          setUserType('locataire');
          return;
        }
      }

      // Chercher dans les colocataires (seulement si les données sont chargées)
      if (roommates.length > 0) {
        const roommateProfile = roommates.find(r => r.email === currentUser.email);
        if (roommateProfile) {
          console.log('👥 Profil colocataire trouvé:', roommateProfile);
          setUserProfile(roommateProfile);
          setUserType('colocataire');
          return;
        }
      }

      // Si les données ne sont pas encore chargées, ne pas définir de profil null
      if (tenants.length === 0 && roommates.length === 0 && !dataLoaded) {
        console.log('⏳ Données pas encore chargées, attente...');
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
      
      if (firebaseUser) {
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
  }, []);

  // Marquer les données comme chargées et vérifier le profil
  useEffect(() => {
    if ((tenants.length > 0 || roommates.length > 0) && !dataLoaded) {
      console.log('📊 Données Firebase chargées:', { tenants: tenants.length, roommates: roommates.length });
      setDataLoaded(true);
      
      // Si un utilisateur est connecté, vérifier son profil avec les nouvelles données
      if (user && !userProfile) {
        console.log('🔄 Re-vérification du profil avec nouvelles données...');
        checkUserProfile(user);
      }
    }
  }, [tenants, roommates, user, userProfile, dataLoaded]);

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
