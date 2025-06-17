
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

  const updateContract = async (id: string | number, updates: Partial<Contract>) => {
    try {
      // Convertir l'ID en string si nécessaire
      const contractId = String(id);
      
      // Validation de l'ID
      if (!contractId || contractId.trim() === '') {
        throw new Error('ID du contrat invalide');
      }

      console.log('Updating contract with ID:', contractId, 'Updates:', updates);
      
      await updateDoc(doc(db, 'Rent_contracts', contractId), updates);
      setContracts(prev => prev.map(contract => 
        contract.id === contractId ? { ...contract, ...updates } : contract
      ));
    } catch (err) {
      console.error('Error updating contract:', err);
      setError('Erreur lors de la mise à jour du contrat');
      throw err;
    }
  };

  const deleteContract = async (id: string | number) => {
    try {
      // Convertir l'ID en string si nécessaire
      const contractId = String(id);
      
      // Validation stricte de l'ID
      if (!contractId || contractId.trim() === '') {
        const errorMsg = 'ID du contrat invalide pour la suppression';
        console.error(errorMsg, { id, type: typeof id });
        throw new Error(errorMsg);
      }

      console.log('Attempting to delete contract with ID:', contractId);
      
      // Vérifier d'abord que le document existe dans Firestore
      const docRef = doc(db, 'Rent_contracts', contractId);
      
      // Supprimer le document
      await deleteDoc(docRef);
      
      // Mettre à jour l'état local seulement après succès de la suppression
      setContracts(prev => {
        const filtered = prev.filter(contract => contract.id !== contractId);
        console.log('Contract deleted successfully. Remaining contracts:', filtered.length);
        return filtered;
      });
      
      console.log('Contract deleted successfully from Firestore and local state');
      
    } catch (err) {
      console.error('Detailed error during contract deletion:', {
        error: err,
        contractId: id,
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
        errorName: err instanceof Error ? err.name : 'Unknown'
      });
      
      // Relancer l'erreur avec un message plus explicite
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression';
      setError(`Erreur lors de la suppression du contrat: ${errorMessage}`);
      throw new Error(`Erreur lors de la suppression du contrat: ${errorMessage}`);
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
