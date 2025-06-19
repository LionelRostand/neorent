
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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Gestion des Virements Bancaires
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Système de paiement par virement avec gestion des bénéficiaires, portefeuilles et transferts
        </p>
      </div>

      <Tabs defaultValue="beneficiaries" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full min-w-fit grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger 
              value="beneficiaries" 
              className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              <span className="hidden xs:inline">Bénéficiaires</span>
              <span className="xs:hidden">Bénéf.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="wallets" 
              className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              <span className="hidden xs:inline">Portefeuilles</span>
              <span className="xs:hidden">Porte.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transfers" 
              className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              Virements
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              Historique
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="beneficiaries" className="mt-4 sm:mt-6">
          <BeneficiaryUserForm 
            onSubmit={handleCreateBeneficiary}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="wallets" className="mt-4 sm:mt-6">
          <WalletManager 
            wallets={wallets}
            onCreateWallet={handleCreateWallet}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="transfers" className="mt-4 sm:mt-6">
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

        <TabsContent value="history" className="mt-4 sm:mt-6">
          <TransferHistory transfers={transfers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankTransferDashboard;
