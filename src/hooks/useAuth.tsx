
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

    // D'abord vérifier dans user_roles (admin/employee)
    const userRole = await getUserRole(currentUser.uid);
    if (userRole) {
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

    // Chercher dans les locataires
    const tenantProfile = tenants.find(t => t.email === currentUser.email);
    if (tenantProfile) {
      setUserProfile(tenantProfile);
      setUserType('locataire');
      return;
    }

    // Chercher dans les colocataires
    const roommateProfile = roommates.find(r => r.email === currentUser.email);
    if (roommateProfile) {
      setUserProfile(roommateProfile);
      setUserType('colocataire');
      return;
    }

    // Si aucun profil trouvé, déconnecter l'utilisateur
    console.log('Aucun profil trouvé pour:', currentUser.email);
    signOut(auth);
    setUserProfile(null);
    setUserType(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Vérifier le profil quand l'utilisateur ou les données Firebase changent
  useEffect(() => {
    if (!loading && user) {
      checkUserProfile(user);
    }
  }, [user, tenants, roommates, loading]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setUserType(null);
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
