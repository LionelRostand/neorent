
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EmployeePermissions } from '@/components/Settings/types/permissions';

interface UserRole {
  id: string;
  role: 'admin' | 'owner' | 'locataire' | 'colocataire';
  email: string;
  name: string;
  createdAt: string;
  permissions?: string[];
  detailedPermissions?: EmployeePermissions;
  hasPassword?: boolean;
  isOwner?: boolean;
}

export const useFirebaseUserRoles = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement des rôles utilisateur...');
      const querySnapshot = await getDocs(collection(db, 'user_roles'));
      const rolesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserRole[];
      
      // Ajouter des utilisateurs test pour locataires et colocataires
      const testUsers: UserRole[] = [
        {
          id: 'tenant_1',
          role: 'locataire' as any,
          email: 'locataire1@test.com',
          name: 'Marie Dupont',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'tenant_2', 
          role: 'colocataire' as any,
          email: 'colocataire1@test.com',
          name: 'Pierre Martin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'emad_adam_tenant',
          role: 'colocataire' as any,
          email: 'entrepreneurpro19@gmail.com',
          name: 'Emad ADAM',
          createdAt: new Date().toISOString(),
        }
      ];
      
      const allRoles = [...rolesData, ...testUsers];
      console.log('📊 Rôles utilisateur chargés (avec données test):', allRoles);
      setUserRoles(allRoles);
      setError(null);
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError('Erreur lors du chargement des rôles utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      const docRef = doc(db, 'user_roles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as UserRole;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user role:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  return {
    userRoles,
    loading,
    error,
    getUserRole,
    refetch: fetchUserRoles
  };
};
