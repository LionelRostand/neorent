
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  paidAmount?: number; // Nouveau champ pour le montant réellement payé
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

export const useFirebasePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_Payments'));
      const paymentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      setPayments(paymentsData);
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
