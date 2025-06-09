
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MenuPermission {
  read: boolean;
  write: boolean;
  view: boolean;
  delete: boolean;
}

interface EmployeePermissions {
  dashboard: MenuPermission;
  properties: MenuPermission;
  tenants: MenuPermission;
  roommates: MenuPermission;
  contracts: MenuPermission;
  inspections: MenuPermission;
  rentManagement: MenuPermission;
  rentalCharges: MenuPermission;
  maintenance: MenuPermission;
  messages: MenuPermission;
  taxes: MenuPermission;
  website: MenuPermission;
  settings: MenuPermission;
}

interface UserRole {
  id: string;
  role: 'admin' | 'employee';
  email: string;
  name: string;
  createdAt: string;
  permissions?: string[];
  detailedPermissions?: EmployeePermissions;
}

export const useFirebaseUserRoles = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'user_roles'));
      const rolesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserRole[];
      setUserRoles(rolesData);
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
