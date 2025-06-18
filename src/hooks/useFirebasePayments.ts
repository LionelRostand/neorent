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
    console.log(`🔍 ENRICHISSEMENT DE: ${payment.tenantName}`, {
      rentAmountOriginal: payment.rentAmount,
      contractRentAmountOriginal: payment.contractRentAmount
    });
    
    const matchingContract = findMatchingContract(payment, contracts);
    let updatedPayment = { ...payment };

    if (matchingContract) {
      const contractAmount = extractContractAmount(matchingContract.amount, payment.rentAmount);
      
      console.log(`✅ CONTRAT TROUVÉ pour ${payment.tenantName}:`, {
        contractAmountExtracted: contractAmount,
        matchingContractAmount: matchingContract.amount
      });
      
      // FORCER l'utilisation EXCLUSIVE du montant du contrat
      updatedPayment = {
        ...payment,
        contractRentAmount: contractAmount,
        rentAmount: contractAmount, // FORCER la cohérence totale
        status: calculatePaymentStatus(payment.paidAmount, contractAmount)
      };
      
      console.log(`🔧 PAIEMENT MIS À JOUR pour ${payment.tenantName}:`, {
        nouveauRentAmount: updatedPayment.rentAmount,
        nouveauContractRentAmount: updatedPayment.contractRentAmount,
        statusRecalcule: updatedPayment.status
      });
    } else {
      console.log(`❌ AUCUN CONTRAT TROUVÉ pour ${payment.tenantName} (${payment.property})`);
      // Si pas de contrat, garder les valeurs originales
      updatedPayment.contractRentAmount = payment.rentAmount;
    }

    return updatedPayment;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('🚀 DÉBUT DU CHARGEMENT DES PAIEMENTS');
      
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

      console.log('📋 DONNÉES BRUTES - Contrats:', contractsData);
      console.log('💰 DONNÉES BRUTES - Paiements:', paymentsData);

      // Enrichir CHAQUE paiement avec les données de contrat
      const enrichedPayments = paymentsData.map(payment => {
        const enriched = enrichPaymentWithContract(payment, contractsData);
        console.log(`📊 PAIEMENT FINAL ${payment.tenantName}:`, {
          rentAmount: enriched.rentAmount,
          contractRentAmount: enriched.contractRentAmount,
          utilisationContrat: enriched.contractRentAmount ? 'OUI' : 'NON'
        });
        return enriched;
      });

      console.log('🎯 TOUS LES PAIEMENTS ENRICHIS:', enrichedPayments);
      setPayments(enrichedPayments);
      setError(null);
    } catch (err) {
      console.error('❌ ERREUR lors du chargement:', err);
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
