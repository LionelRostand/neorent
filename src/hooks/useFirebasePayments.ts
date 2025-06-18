
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Payment, Contract } from '@/types/payment';
import { findMatchingContract, extractContractAmount } from '@/utils/contractMatching';
import { 
  calculatePaymentStatus, 
  formatPaymentMethod, 
  logPaymentProcessing, 
  logFinalResult 
} from '@/utils/paymentCalculations';

export const useFirebasePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enrichPaymentWithContract = (payment: Payment, contracts: Contract[]): Payment => {
    logPaymentProcessing(payment);
    
    const matchingContract = findMatchingContract(payment, contracts);
    let updatedPayment = { ...payment };

    if (matchingContract) {
      const contractAmount = extractContractAmount(matchingContract.amount, payment.rentAmount);
      
      logPaymentProcessing(payment, contractAmount);
      
      updatedPayment.contractRentAmount = contractAmount;
      updatedPayment.status = calculatePaymentStatus(payment.paidAmount, contractAmount);
      
      if (payment.paidAmount !== undefined && payment.paidAmount !== null) {
        const paidAmount = Number(payment.paidAmount);
        if (paidAmount > contractAmount) {
          console.log(`⚠️ TROP-PERÇU: ${paidAmount}€ payé pour ${contractAmount}€ attendu`);
        } else if (paidAmount < contractAmount && paidAmount > 0) {
          console.log(`🚨 PAIEMENT PARTIEL: ${paidAmount}€ payé sur ${contractAmount}€ attendu`);
        }
      }
    } else {
      console.log(`❌ AUCUN CONTRAT TROUVÉ pour ${payment.tenantName} (${payment.property})`);
      updatedPayment.contractRentAmount = payment.rentAmount;
    }

    logFinalResult(updatedPayment);
    return updatedPayment;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const [paymentsSnapshot, contractsSnapshot] = await Promise.all([
        getDocs(collection(db, 'Rent_Payments')),
        getDocs(collection(db, 'Rent_contracts'))
      ]);

      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];

      const contractsData = contractsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contract[];

      console.log('📋 DONNÉES COMPLÈTES - Contrats récupérés:', contractsData);
      console.log('💰 DONNÉES COMPLÈTES - Paiements récupérés:', paymentsData);

      const enrichedPayments = paymentsData.map(payment => 
        enrichPaymentWithContract(payment, contractsData)
      );

      console.log('🔧 PAIEMENTS FINAUX avec contrats:', enrichedPayments);
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
      const formattedPaymentData = {
        ...paymentData,
        paymentMethod: formatPaymentMethod(paymentData.paymentMethod)
      };

      const docRef = await addDoc(collection(db, 'Rent_Payments'), formattedPaymentData);
      const newPayment = { id: docRef.id, ...formattedPaymentData };
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
      const formattedUpdates = {
        ...updates,
        paymentMethod: updates.paymentMethod ? 
          formatPaymentMethod(updates.paymentMethod) :
          updates.paymentMethod
      };

      await updateDoc(doc(db, 'Rent_Payments', id), formattedUpdates);
      setPayments(prev => prev.map(payment => 
        payment.id === id ? { ...payment, ...formattedUpdates } : payment
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
