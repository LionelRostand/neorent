
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface RentFiscality {
  id: string;
  title: string;
  type: string;
  property: string;
  amount: string;
  dueDate: string;
  status: 'À payer' | 'Payée' | 'À déclarer';
  year: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useFirebaseFiscality = () => {
  const [fiscalities, setFiscalities] = useState<RentFiscality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiscalities = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'rent_fiscality'), orderBy('year', 'desc'));
      const querySnapshot = await getDocs(q);
      const fiscalityData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RentFiscality));
      
      setFiscalities(fiscalityData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des fiscalités:', err);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const addFiscality = async (fiscalityData: Omit<RentFiscality, 'id'>) => {
    try {
      const docData = {
        ...fiscalityData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'rent_fiscality'), docData);
      const newFiscality = { id: docRef.id, ...docData };
      
      setFiscalities(prev => [newFiscality, ...prev]);
      return newFiscality;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la fiscalité:', err);
      throw new Error('Erreur lors de l\'ajout');
    }
  };

  const updateFiscality = async (id: string, updates: Partial<RentFiscality>) => {
    try {
      const docRef = doc(db, 'rent_fiscality', id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updateData);
      
      setFiscalities(prev => prev.map(fiscality => 
        fiscality.id === id ? { ...fiscality, ...updateData } : fiscality
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la fiscalité:', err);
      throw new Error('Erreur lors de la mise à jour');
    }
  };

  const deleteFiscality = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'rent_fiscality', id));
      setFiscalities(prev => prev.filter(fiscality => fiscality.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la fiscalité:', err);
      throw new Error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchFiscalities();
  }, []);

  return {
    fiscalities,
    loading,
    error,
    addFiscality,
    updateFiscality,
    deleteFiscality,
    refetch: fetchFiscalities
  };
};
