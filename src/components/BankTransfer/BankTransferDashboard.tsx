
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebaseBankTransfers } from '@/hooks/useFirebaseBankTransfers';
import BeneficiaryUserForm from './BeneficiaryUserForm';
import WalletManager from './WalletManager';
import TransferForm from './TransferForm';
import TransferHistory from './TransferHistory';
import { BeneficiaryUser, Wallet, BankTransfer } from '@/types/bankTransfer';

const BankTransferDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  const {
    beneficiaries,
    wallets,
    transfers,
    loading,
    createBeneficiary,
    createWallet,
    createTransfer
  } = useFirebaseBankTransfers();

  const handleCreateBeneficiary = async (userData: Omit<BeneficiaryUser, 'id' | 'status' | 'createdAt'>) => {
    await createBeneficiary(userData);
  };

  const handleCreateWallet = async (walletData: Omit<Wallet, 'id' | 'status' | 'createdAt'>) => {
    await createWallet(walletData);
  };

  const handleCreateTransfer = async (transferData: Omit<BankTransfer, 'id' | 'status' | 'createdAt'>) => {
    await createTransfer(transferData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Virements Bancaires</h1>
        <p className="text-gray-600 mt-2">
          Système de paiement par virement avec gestion des bénéficiaires, portefeuilles et transferts
        </p>
      </div>

      <Tabs defaultValue="beneficiaries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="beneficiaries" className="text-xs sm:text-sm">Bénéficiaires</TabsTrigger>
          <TabsTrigger value="wallets" className="text-xs sm:text-sm">Portefeuilles</TabsTrigger>
          <TabsTrigger value="transfers" className="text-xs sm:text-sm">Virements</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">Historique</TabsTrigger>
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
