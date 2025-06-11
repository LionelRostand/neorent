
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Contract {
  id: string;
  title: string;
  type: string;
  provider: string;
  property: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
  tenant: string;
  jurisdiction: string;
  signatures?: {
    owner?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
    tenant?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
  };
  signedDate?: string;
}

export const useFirebaseContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_contracts'));
      const contractsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contract[];
      setContracts(contractsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError('Erreur lors du chargement des contrats');
    } finally {
      setLoading(false);
    }
  };

  const addContract = async (contractData: Omit<Contract, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_contracts'), contractData);
      const newContract = { id: docRef.id, ...contractData };
      setContracts(prev => [...prev, newContract]);
      return newContract;
    } catch (err) {
      console.error('Error adding contract:', err);
      setError('Erreur lors de l\'ajout du contrat');
      throw err;
    }
  };

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID du contrat invalide');
      }

      console.log('Updating contract with ID:', id, 'Updates:', updates);
      
      await updateDoc(doc(db, 'Rent_contracts', id), updates);
      setContracts(prev => prev.map(contract => 
        contract.id === id ? { ...contract, ...updates } : contract
      ));
    } catch (err) {
      console.error('Error updating contract:', err);
      setError('Erreur lors de la mise à jour du contrat');
      throw err;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID du contrat invalide');
      }

      await deleteDoc(doc(db, 'Rent_contracts', id));
      setContracts(prev => prev.filter(contract => contract.id !== id));
    } catch (err) {
      console.error('Error deleting contract:', err);
      setError('Erreur lors de la suppression du contrat');
      throw err;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    addContract,
    updateContract,
    deleteContract,
    refetch: fetchContracts
  };
};
