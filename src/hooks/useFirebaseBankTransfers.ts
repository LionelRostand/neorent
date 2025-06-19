
import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BeneficiaryUser, Wallet, BankTransfer } from '@/types/bankTransfer';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseBankTransfers = () => {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryUser[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Charger les bénéficiaires
  const fetchBeneficiaries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Bank_Beneficiaries'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BeneficiaryUser[];
      setBeneficiaries(data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  // Charger les portefeuilles
  const fetchWallets = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Bank_Wallets'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Wallet[];
      setWallets(data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  // Charger les transferts
  const fetchTransfers = async () => {
    try {
      const q = query(
        collection(db, 'Bank_Transfers'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BankTransfer[];
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  // Créer un bénéficiaire
  const createBeneficiary = async (userData: Omit<BeneficiaryUser, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newBeneficiary = {
        ...userData,
        bankAccount: {
          ...userData.bankAccount,
          id: Date.now().toString(),
          status: 'pending' as const,
          createdAt: new Date().toISOString()
        },
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'Bank_Beneficiaries'), newBeneficiary);
      const createdBeneficiary = { id: docRef.id, ...newBeneficiary };
      setBeneficiaries(prev => [...prev, createdBeneficiary]);
      
      toast({
        title: "Compte bénéficiaire créé",
        description: `Le compte de ${userData.firstName} ${userData.lastName} a été créé avec succès`,
      });

      return createdBeneficiary;
    } catch (error) {
      console.error('Error creating beneficiary:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte bénéficiaire",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Créer un portefeuille
  const createWallet = async (walletData: Omit<Wallet, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newWallet = {
        ...walletData,
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'Bank_Wallets'), newWallet);
      const createdWallet = { id: docRef.id, ...newWallet };
      setWallets(prev => [...prev, createdWallet]);
      
      toast({
        title: "Portefeuille créé",
        description: `Portefeuille ${walletData.currency} créé pour l'utilisateur ${walletData.userId}`,
      });

      return createdWallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le portefeuille",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Créer un transfert
  const createTransfer = async (transferData: Omit<BankTransfer, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newTransfer = {
        ...transferData,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'Bank_Transfers'), newTransfer);
      const createdTransfer = { id: docRef.id, ...newTransfer };
      setTransfers(prev => [...prev, createdTransfer]);
      
      // Déduire le montant du portefeuille source
      setWallets(prev => prev.map(wallet => 
        wallet.id === transferData.walletId 
          ? { ...wallet, balance: wallet.balance - transferData.amount }
          : wallet
      ));

      // Mettre à jour le portefeuille dans Firebase
      const walletRef = doc(db, 'Bank_Wallets', transferData.walletId);
      const wallet = wallets.find(w => w.id === transferData.walletId);
      if (wallet) {
        await updateDoc(walletRef, {
          balance: wallet.balance - transferData.amount
        });
      }
      
      toast({
        title: "Virement initié",
        description: `Virement de ${(transferData.amount / 100).toFixed(2)}€ en cours de traitement`,
      });

      // Simuler la mise à jour du statut après quelques secondes
      setTimeout(async () => {
        try {
          const transferRef = doc(db, 'Bank_Transfers', docRef.id);
          await updateDoc(transferRef, {
            status: 'succeeded',
            processedAt: new Date().toISOString()
          });

          setTransfers(prev => prev.map(t => 
            t.id === docRef.id 
              ? { ...t, status: 'succeeded', processedAt: new Date().toISOString() }
              : t
          ));
          
          toast({
            title: "Virement réussi",
            description: `Le virement de ${(transferData.amount / 100).toFixed(2)}€ a été traité avec succès`,
          });
        } catch (error) {
          console.error('Error updating transfer status:', error);
        }
      }, 5000);

      return createdTransfer;
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initier le virement",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Charger toutes les données au montage
  useEffect(() => {
    fetchBeneficiaries();
    fetchWallets();
    fetchTransfers();
  }, []);

  return {
    beneficiaries,
    wallets,
    transfers,
    loading,
    createBeneficiary,
    createWallet,
    createTransfer,
    refetchAll: () => {
      fetchBeneficiaries();
      fetchWallets();
      fetchTransfers();
    }
  };
};
