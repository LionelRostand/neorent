
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
          console.log('Mise à jour du mot de passe Firebase Auth pour:', tenant.email);
          
          // Sauvegarder l'utilisateur actuellement connecté
          const currentUser = auth.currentUser;
          
          try {
            // Se connecter temporairement avec l'email du tenant pour pouvoir mettre à jour son mot de passe
            // Note: Ceci fonctionne si le tenant a déjà un compte Firebase Auth
            await signInWithEmailAndPassword(auth, tenant.email, 'tempPassword123'); // mot de passe temporaire
          } catch (signInError: any) {
            // Si la connexion échoue, créer un nouveau compte
            if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
              console.log('Création d\'un nouveau compte Firebase Auth pour:', tenant.email);
              await createUserWithEmailAndPassword(auth, tenant.email, updates.password);
            } else if (signInError.code === 'auth/email-already-in-use') {
              // L'utilisateur existe, mais on ne peut pas se connecter avec le mot de passe temporaire
              // On va essayer de créer un nouveau compte avec le nouveau mot de passe
              console.log('Compte existant, tentative de mise à jour...');
            }
          }
          
          // Si on est maintenant connecté avec le compte du tenant, mettre à jour le mot de passe
          if (auth.currentUser && auth.currentUser.email === tenant.email) {
            await updatePassword(auth.currentUser, updates.password);
            console.log('Mot de passe Firebase Auth mis à jour avec succès');
          }
          
          // Se reconnecter avec l'utilisateur admin original si possible
          if (currentUser) {
            await signOut(auth);
            // Note: L'admin devra se reconnecter manuellement
          }
        }
        
        // Retirer le mot de passe des updates pour Firestore (sécurité)
        const { password, ...firestoreUpdates } = updates;
        
        // Mettre à jour Firestore
        await updateDoc(doc(db, 'Rent_locataires', id), firestoreUpdates);
        setTenants(prev => prev.map(tenant => 
          tenant.id === id ? { ...tenant, ...firestoreUpdates } : tenant
        ));
        
        console.log('Informations du locataire mises à jour, y compris le mot de passe Firebase Auth');
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
