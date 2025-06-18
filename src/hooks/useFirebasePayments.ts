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

      console.log('📋 DONNÉES COMPLÈTES - Contrats récupérés:', contractsData);
      console.log('💰 DONNÉES COMPLÈTES - Paiements récupérés:', paymentsData);

      // Associer les montants des contrats aux paiements
      const enrichedPayments = paymentsData.map(payment => {
        console.log(`\n🔍 TRAITEMENT DE: ${payment.tenantName}`);
        console.log(`   Propriété: ${payment.property}`);
        console.log(`   Montant actuel rentAmount: ${payment.rentAmount}€`);
        console.log(`   Montant payé: ${payment.paidAmount}€`);
        
        // Chercher le contrat correspondant au locataire
        const matchingContract = contractsData.find(contract => {
          const nameMatch = contract.tenant === payment.tenantName;
          const propertyMatch = contract.property === payment.property;
          const statusMatch = contract.status === 'Actif' || contract.status === 'Signé';
          
          console.log(`   🔎 Contrat testé:`, {
            contractTenant: contract.tenant,
            contractProperty: contract.property,
            contractStatus: contract.status,
            nameMatch,
            propertyMatch,
            statusMatch
          });
          
          return nameMatch && propertyMatch && statusMatch;
        });

        let updatedPayment = { ...payment };

        if (matchingContract) {
          // Extraire le montant numérique du contrat (ex: "450€" -> 450)
          const contractAmountStr = matchingContract.amount;
          let contractAmount = 0;
          
          // Gérer différents formats de montant
          if (typeof contractAmountStr === 'string') {
            // Supprimer tout ce qui n'est pas un chiffre pour extraire le montant
            const numericPart = contractAmountStr.replace(/[^\d]/g, '');
            contractAmount = parseInt(numericPart) || payment.rentAmount;
          } else if (typeof contractAmountStr === 'number') {
            contractAmount = contractAmountStr;
          } else {
            contractAmount = payment.rentAmount;
          }
          
          console.log(`✅ CONTRAT TROUVÉ pour ${payment.tenantName}:`);
          console.log(`   - Montant brut contrat: "${matchingContract.amount}"`);
          console.log(`   - Montant numérique extrait: ${contractAmount}€`);
          console.log(`   - Ancien rentAmount: ${payment.rentAmount}€`);
          
          // FORCER l'utilisation du montant du contrat comme référence
          updatedPayment.contractRentAmount = contractAmount;
          // IMPORTANT: Garder le rentAmount original mais ajouter contractRentAmount
          // pour que PaymentAmounts puisse utiliser le bon montant d'affichage
          
          // Recalculer le statut basé sur le montant du contrat
          if (payment.paidAmount !== undefined && payment.paidAmount !== null) {
            const paidAmount = Number(payment.paidAmount);
            
            if (paidAmount < contractAmount && paidAmount > 0) {
              updatedPayment.status = 'En retard';
              console.log(`🚨 PAIEMENT PARTIEL: ${paidAmount}€ payé sur ${contractAmount}€ attendu`);
            } else if (paidAmount === 0) {
              updatedPayment.status = 'En attente';
            } else if (paidAmount >= contractAmount) {
              updatedPayment.status = 'Payé';
              if (paidAmount > contractAmount) {
                console.log(`⚠️ TROP-PERÇU: ${paidAmount}€ payé pour ${contractAmount}€ attendu`);
              }
            }
          } else {
            updatedPayment.status = 'En attente';
          }
        } else {
          console.log(`❌ AUCUN CONTRAT TROUVÉ pour ${payment.tenantName} (${payment.property})`);
          console.log(`   Contrats disponibles:`, contractsData.map(c => `${c.tenant} - ${c.property} (${c.status})`));
          // Garder les données actuelles si aucun contrat trouvé
          updatedPayment.contractRentAmount = payment.rentAmount;
        }

        console.log(`📊 RÉSULTAT FINAL pour ${updatedPayment.tenantName}:`, {
          rentAmount: updatedPayment.rentAmount,
          contractRentAmount: updatedPayment.contractRentAmount,
          paidAmount: updatedPayment.paidAmount,
          status: updatedPayment.status,
          hasDiscrepancy: updatedPayment.paidAmount !== updatedPayment.contractRentAmount
        });

        return updatedPayment;
      });

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
      // Formater les données avant l'ajout
      const formattedPaymentData = {
        ...paymentData,
        paymentMethod: paymentData.paymentMethod ? 
          paymentData.paymentMethod.charAt(0).toUpperCase() + paymentData.paymentMethod.slice(1).toLowerCase() :
          null
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
      // Formater les données avant la mise à jour
      const formattedUpdates = {
        ...updates,
        paymentMethod: updates.paymentMethod ? 
          updates.paymentMethod.charAt(0).toUpperCase() + updates.paymentMethod.slice(1).toLowerCase() :
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
