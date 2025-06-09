
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Roommate {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  roomNumber: string;
  rentAmount: string;
  status: string;
  primaryTenant: string;
  moveInDate: string;
  image: string | null;
}

export const useFirebaseRoommates = () => {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_colocataires'));
      const roommatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Roommate[];
      setRoommates(roommatesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching roommates:', err);
      setError('Erreur lors du chargement des colocataires');
    } finally {
      setLoading(false);
    }
  };

  const addRoommate = async (roommateData: Omit<Roommate, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_colocataires'), roommateData);
      const newRoommate = { id: docRef.id, ...roommateData };
      setRoommates(prev => [...prev, newRoommate]);
      return newRoommate;
    } catch (err) {
      console.error('Error adding roommate:', err);
      setError('Erreur lors de l\'ajout du colocataire');
      throw err;
    }
  };

  const updateRoommate = async (id: string, updates: Partial<Roommate>) => {
    try {
      await updateDoc(doc(db, 'Rent_colocataires', id), updates);
      setRoommates(prev => prev.map(roommate => 
        roommate.id === id ? { ...roommate, ...updates } : roommate
      ));
    } catch (err) {
      console.error('Error updating roommate:', err);
      setError('Erreur lors de la mise à jour du colocataire');
      throw err;
    }
  };

  const deleteRoommate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_colocataires', id));
      setRoommates(prev => prev.filter(roommate => roommate.id !== id));
    } catch (err) {
      console.error('Error deleting roommate:', err);
      setError('Erreur lors de la suppression du colocataire');
      throw err;
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, []);

  return {
    roommates,
    loading,
    error,
    addRoommate,
    updateRoommate,
    deleteRoommate,
    refetch: fetchRoommates
  };
};
