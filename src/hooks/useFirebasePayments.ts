
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  contractRentAmount?: number; // Montant du contrat
  paidAmount?: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface Contract {
  id: string;
  tenant: string;
  property: string;
  amount: string;
  status: string;
  type: string;
}

export const useFirebasePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Récupérer les paiements
      const paymentsSnapshot = await getDocs(collection(db, 'Rent_Payments'));
      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];

      // Récupérer les contrats pour obtenir les montants corrects
      const contractsSnapshot = await getDocs(collection(db, 'Rent_contracts'));
      const contractsData = contractsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contract[];

      // Associer les montants des contrats aux paiements
      const enrichedPayments = paymentsData.map(payment => {
        // Chercher le contrat correspondant au locataire
        const matchingContract = contractsData.find(contract => 
          contract.tenant === payment.tenantName && 
          contract.property === payment.property &&
          (contract.status === 'Actif' || contract.status === 'Signé')
        );

        if (matchingContract) {
          // Extraire le montant numérique du contrat (ex: "1200€" -> 1200)
          const contractAmount = parseInt(matchingContract.amount.replace(/[€\s]/g, '')) || payment.rentAmount;
          
          console.log(`Contrat trouvé pour ${payment.tenantName}: ${matchingContract.amount} -> ${contractAmount}€`);
          
          return {
            ...payment,
            contractRentAmount: contractAmount,
            rentAmount: contractAmount // Utiliser le montant du contrat
          };
        }

        console.log(`Aucun contrat trouvé pour ${payment.tenantName} - ${payment.property}`);
        return payment;
      });

      setPayments(enrichedPayments);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (paymentData: Omit<Payment, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_Payments'), paymentData);
      const newPayment = { id: docRef.id, ...paymentData };
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      console.error('Error adding payment:', err);
      setError('Erreur lors de l\'ajout du paiement');
      throw err;
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      await updateDoc(doc(db, 'Rent_Payments', id), updates);
      setPayments(prev => prev.map(payment => 
        payment.id === id ? { ...payment, ...updates } : payment
      ));
    } catch (err) {
      console.error('Error updating payment:', err);
      setError('Erreur lors de la mise à jour du paiement');
      throw err;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_Payments', id));
      setPayments(prev => prev.filter(payment => payment.id !== id));
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError('Erreur lors de la suppression du paiement');
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments
  };
};
