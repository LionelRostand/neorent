import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  createdAt: Date;
}

export const useFirebaseSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'suppliers'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const suppliersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Supplier[];
        
        setSuppliers(suppliersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching suppliers:', err);
        setError('Erreur lors du chargement des fournisseurs');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'suppliers'), {
        ...supplierData,
        createdAt: new Date()
      });
    } catch (err) {
      console.error('Error adding supplier:', err);
      throw new Error('Erreur lors de l\'ajout du fournisseur');
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      await updateDoc(doc(db, 'suppliers', id), updates);
    } catch (err) {
      console.error('Error updating supplier:', err);
      throw new Error('Erreur lors de la mise à jour du fournisseur');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id));
    } catch (err) {
      console.error('Error deleting supplier:', err);
      throw new Error('Erreur lors de la suppression du fournisseur');
    }
  };

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
};