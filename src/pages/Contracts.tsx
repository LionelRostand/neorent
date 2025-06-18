
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import ContractsHeader from '@/components/Contracts/ContractsHeader';
import ContractsMetrics from '@/components/Contracts/ContractsMetrics';
import ContractsList from '@/components/Contracts/ContractsList';
import ContractEditModal from '@/components/ContractEditModal';
import ContractSigningModal from '@/components/ContractSigning/ContractSigningModal';
import ContractDetailsModal from '@/components/ContractDetailsModal';
import { useContractsActions } from '@/hooks/useContractsActions';

const Contracts = () => {
  const { t } = useTranslation();
  const {
    contracts,
    loading,
    error,
    activeCount,
    expiredCount,
    totalCount,
    isDialogOpen,
    setIsDialogOpen,
    editingContract,
    isEditModalOpen,
    setIsEditModalOpen,
    signingContract,
    isSigningModalOpen,
    setIsSigningModalOpen,
    detailsContract,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    handleAddContract,
    handleEditContract,
    handleUpdateContract,
    handleSignContract,
    handleSigningComplete,
    handleDeleteContract,
    handleViewDetails,
  } = useContractsActions();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('contracts.loading')}</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{t('common.error')}: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <ContractsHeader
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onAddContract={handleAddContract}
        />

        <ContractsMetrics
          activeCount={activeCount}
          expiredCount={expiredCount}
          totalCount={totalCount}
        />

        <ContractsList
          contracts={contracts}
          onEdit={handleEditContract}
          onDelete={handleDeleteContract}
          onViewDetails={handleViewDetails}
          onSign={handleSignContract}
        />

        <ContractEditModal
          contract={editingContract}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateContract}
        />

        <ContractSigningModal
          contract={signingContract}
          isOpen={isSigningModalOpen}
          onClose={() => setIsSigningModalOpen(false)}
          onSigningComplete={handleSigningComplete}
        />

        <ContractDetailsModal
          contract={detailsContract}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default Contracts;
