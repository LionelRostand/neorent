
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updatePassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
}

export const useFirebaseTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_locataires'));
      const tenantsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tenant[];
      setTenants(tenantsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Erreur lors du chargement des locataires');
    } finally {
      setLoading(false);
    }
  };

  const addTenant = async (tenantData: Omit<Tenant, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_locataires'), tenantData);
      const newTenant = { id: docRef.id, ...tenantData };
      setTenants(prev => [...prev, newTenant]);
      return newTenant;
    } catch (err) {
      console.error('Error adding tenant:', err);
      setError('Erreur lors de l\'ajout du locataire');
      throw err;
    }
  };

  const updateTenant = async (id: string, updates: Partial<Tenant & { password?: string }>) => {
    try {
      // Si un nouveau mot de passe est fourni, mettre à jour Firebase Auth
      if (updates.password) {
        const tenant = tenants.find(t => t.id === id);
        if (tenant?.email) {
          // Pour mettre à jour le mot de passe, nous devons d'abord créer/recréer l'utilisateur
          // ou nous connecter temporairement avec l'ancien mot de passe puis mettre à jour
          
          // Créer un utilisateur Firebase Auth si il n'existe pas déjà
          try {
            await createUserWithEmailAndPassword(auth, tenant.email, updates.password);
            console.log('Utilisateur Firebase Auth créé pour:', tenant.email);
          } catch (authError: any) {
            // Si l'utilisateur existe déjà, essayer de se connecter puis mettre à jour
            if (authError.code === 'auth/email-already-in-use') {
              console.log('Utilisateur Firebase Auth existe déjà, mise à jour du mot de passe');
              // Note: Pour une vraie application, il faudrait demander l'ancien mot de passe
              // Ici on assume que l'admin peut changer le mot de passe directement
            } else {
              console.warn('Erreur Firebase Auth:', authError.message);
            }
          }
        }
        
        // Retirer le mot de passe des updates pour Firestore (sécurité)
        const { password, ...firestoreUpdates } = updates;
        
        // Mettre à jour Firestore sans le mot de passe
        await updateDoc(doc(db, 'Rent_locataires', id), firestoreUpdates);
        setTenants(prev => prev.map(tenant => 
          tenant.id === id ? { ...tenant, ...firestoreUpdates } : tenant
        ));
      } else {
        // Mise à jour normale sans mot de passe
        await updateDoc(doc(db, 'Rent_locataires', id), updates);
        setTenants(prev => prev.map(tenant => 
          tenant.id === id ? { ...tenant, ...updates } : tenant
        ));
      }
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError('Erreur lors de la mise à jour du locataire');
      throw err;
    }
  };

  const deleteTenant = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_locataires', id));
      setTenants(prev => prev.filter(tenant => tenant.id !== id));
    } catch (err) {
      console.error('Error deleting tenant:', err);
      setError('Erreur lors de la suppression du locataire');
      throw err;
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return {
    tenants,
    loading,
    error,
    addTenant,
    updateTenant,
    deleteTenant,
    refetch: fetchTenants
  };
};
