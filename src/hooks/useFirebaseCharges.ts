
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ChargeData {
  id: string;
  propertyName: string;
  propertyType: string;
  month: string;
  electricity: number;
  water: number;
  heating: number;
  maintenance: number;
  insurance: number;
  garbage: number;
  internet: number;
  total: number;
  tenant: string;
}

export const useFirebaseCharges = () => {
  const [charges, setCharges] = useState<ChargeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharges = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_Charges'));
      const chargesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChargeData[];
      setCharges(chargesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching charges:', err);
      setError('Erreur lors du chargement des charges');
    } finally {
      setLoading(false);
    }
  };

  const addCharge = async (chargeData: Omit<ChargeData, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_Charges'), chargeData);
      const newCharge = { id: docRef.id, ...chargeData };
      setCharges(prev => [...prev, newCharge]);
      return newCharge;
    } catch (err) {
      console.error('Error adding charge:', err);
      setError('Erreur lors de l\'ajout de la charge');
      throw err;
    }
  };

  const updateCharge = async (id: string, updates: Partial<ChargeData>) => {
    try {
      await updateDoc(doc(db, 'Rent_Charges', id), updates);
      setCharges(prev => prev.map(charge => 
        charge.id === id ? { ...charge, ...updates } : charge
      ));
    } catch (err) {
      console.error('Error updating charge:', err);
      setError('Erreur lors de la mise à jour de la charge');
      throw err;
    }
  };

  const deleteCharge = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_Charges', id));
      setCharges(prev => prev.filter(charge => charge.id !== id));
    } catch (err) {
      console.error('Error deleting charge:', err);
      setError('Erreur lors de la suppression de la charge');
      throw err;
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  return {
    charges,
    loading,
    error,
    addCharge,
    updateCharge,
    deleteCharge,
    refetch: fetchCharges
  };
};
