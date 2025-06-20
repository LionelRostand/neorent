
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PaymentValidation {
  id: string;
  paymentId: string;
  tenantName: string;
  amount: number;
  paymentDate: string;
  validationStatus: 'pending' | 'validated' | 'rejected';
  validatedAt?: string;
  validatedBy?: string;
  validationComment?: string;
  receiptGenerated?: boolean;
}

export const usePaymentValidation = () => {
  const [pendingValidations, setPendingValidations] = useState<PaymentValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingValidations = async () => {
    try {
      setLoading(true);
      
      // Récupérer les paiements en attente de validation
      const paymentsSnapshot = await getDocs(collection(db, 'Rent_Payments'));
      const payments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filtrer ceux qui sont des virements et en attente de validation
      const pendingBankTransfers = payments.filter(payment => 
        payment.paymentMethod === 'Virement' && 
        (payment.validationStatus === 'pending' || !payment.validationStatus)
      );

      setPendingValidations(pendingBankTransfers as PaymentValidation[]);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des validations:', err);
      setError('Erreur lors du chargement des validations en attente');
    } finally {
      setLoading(false);
    }
  };

  const validatePayment = async (
    paymentId: string, 
    decision: 'validated' | 'rejected',
    comment?: string
  ) => {
    try {
      const updateData = {
        validationStatus: decision,
        validatedAt: new Date().toISOString(),
        validatedBy: 'Bailleur', // À remplacer par l'utilisateur connecté
        validationComment: comment || null,
        receiptGenerated: decision === 'validated' ? true : false
      };

      // Mettre à jour le paiement
      await updateDoc(doc(db, 'Rent_Payments', paymentId), updateData);

      // Si validé, créer une entrée dans les reçus générés
      if (decision === 'validated') {
        const payment = pendingValidations.find(p => p.id === paymentId);
        if (payment) {
          await addDoc(collection(db, 'Payment_Receipts'), {
            paymentId: paymentId,
            tenantName: payment.tenantName,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            generatedAt: new Date().toISOString(),
            receiptType: 'quittance_loyer',
            status: 'generated'
          });
        }
      }

      // Recharger les données
      await fetchPendingValidations();
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
      throw new Error('Impossible de valider le paiement');
    }
  };

  const markReceiptAsGenerated = async (paymentId: string) => {
    try {
      await updateDoc(doc(db, 'Rent_Payments', paymentId), {
        receiptGenerated: true,
        receiptGeneratedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du reçu:', err);
    }
  };

  useEffect(() => {
    fetchPendingValidations();
  }, []);

  return {
    pendingValidations,
    loading,
    error,
    validatePayment,
    markReceiptAsGenerated,
    refetch: fetchPendingValidations
  };
};
