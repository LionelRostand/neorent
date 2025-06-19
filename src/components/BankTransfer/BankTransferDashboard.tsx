
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import BeneficiaryUserForm from './BeneficiaryUserForm';
import WalletManager from './WalletManager';
import TransferForm from './TransferForm';
import TransferHistory from './TransferHistory';
import { BeneficiaryUser, Wallet, BankTransfer } from '@/types/bankTransfer';

const BankTransferDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // États simulés (à remplacer par des hooks Firebase)
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryUser[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateBeneficiary = async (userData: Omit<BeneficiaryUser, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBeneficiary: BeneficiaryUser = {
        ...userData,
        id: Date.now().toString(),
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setBeneficiaries(prev => [...prev, newBeneficiary]);
      
      toast({
        title: "Compte bénéficiaire créé",
        description: `Le compte de ${userData.firstName} ${userData.lastName} a été créé avec succès`,
      });
      
      console.log('✅ POST /users:', newBeneficiary);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte bénéficiaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async (walletData: Omit<Wallet, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newWallet: Wallet = {
        ...walletData,
        id: Date.now().toString(),
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setWallets(prev => [...prev, newWallet]);
      
      toast({
        title: "Portefeuille créé",
        description: `Portefeuille ${newWallet.currency} créé pour l'utilisateur ${walletData.userId}`,
      });
      
      console.log('✅ POST /wallets:', newWallet);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le portefeuille",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = async (transferData: Omit<BankTransfer, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransfer: BankTransfer = {
        ...transferData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setTransfers(prev => [...prev, newTransfer]);
      
      // Déduire le montant du portefeuille source
      setWallets(prev => prev.map(wallet => 
        wallet.id === transferData.walletId 
          ? { ...wallet, balance: wallet.balance - transferData.amount }
          : wallet
      ));
      
      toast({
        title: "Virement initié",
        description: `Virement de ${(transferData.amount / 100).toFixed(2)}€ en cours de traitement`,
      });
      
      console.log('✅ POST /transfers:', newTransfer);
      
      // Simuler la mise à jour du statut après quelques secondes
      setTimeout(() => {
        setTransfers(prev => prev.map(t => 
          t.id === newTransfer.id 
            ? { ...t, status: 'succeeded', processedAt: new Date().toISOString() }
            : t
        ));
        
        toast({
          title: "Virement réussi",
          description: `Le virement de ${(transferData.amount / 100).toFixed(2)}€ a été traité avec succès`,
        });
      }, 5000);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initier le virement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des Virements Bancaires</h1>
        <p className="text-gray-600 mt-2">
          Système de paiement par virement avec gestion des bénéficiaires, portefeuilles et transferts
        </p>
      </div>

      <Tabs defaultValue="beneficiaries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="beneficiaries">Bénéficiaires</TabsTrigger>
          <TabsTrigger value="wallets">Portefeuilles</TabsTrigger>
          <TabsTrigger value="transfers">Virements</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="beneficiaries">
          <BeneficiaryUserForm 
            onSubmit={handleCreateBeneficiary}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="wallets">
          <WalletManager 
            wallets={wallets}
            onCreateWallet={handleCreateWallet}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="transfers">
          <TransferForm 
            wallets={wallets}
            bankAccounts={beneficiaries.map(b => ({
              id: b.bankAccount.id || b.id,
              iban: b.bankAccount.iban,
              accountHolder: b.bankAccount.accountHolder
            }))}
            onSubmit={handleCreateTransfer}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="history">
          <TransferHistory transfers={transfers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankTransferDashboard;
