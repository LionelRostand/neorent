
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import ContractsHeader from '@/components/Contracts/ContractsHeader';
import ContractsMetrics from '@/components/Contracts/ContractsMetrics';
import ContractsList from '@/components/Contracts/ContractsList';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useToast } from '@/hooks/use-toast';
import { useOwnerFilter } from '@/hooks/useOwnerFilter';

const Contracts = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { contracts, loading, error, addContract, updateContract, deleteContract } = useFirebaseContracts();
  const { toast } = useToast();
  const { filterByOwner } = useOwnerFilter();

  // Filtrer les contrats par propriétaire si nécessaire
  const filteredContracts = filterByOwner(contracts);

  const handleAddContract = async (data: any) => {
    try {
      await addContract(data);
      toast({
        title: t('common.success'),
        description: t('contracts.addSuccess'),
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du contrat:', err);
      toast({
        title: t('common.error'),
        description: t('contracts.addError'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateContract = async (id: string, updates: any) => {
    try {
      await updateContract(id, updates);
      toast({
        title: t('common.success'),
        description: t('contracts.updateSuccess'),
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du contrat:', err);
      toast({
        title: t('common.error'),
        description: t('contracts.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm(t('contracts.confirmDelete'))) {
      try {
        await deleteContract(id);
        toast({
          title: t('common.success'),
          description: t('contracts.deleteSuccess'),
        });
      } catch (err) {
        console.error('Erreur lors de la suppression du contrat:', err);
        toast({
          title: t('common.error'),
          description: t('contracts.deleteError'),
          variant: "destructive",
        });
      }
    }
  };

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

        <ContractsMetrics contracts={filteredContracts} />

        <ContractsList
          contracts={filteredContracts}
          onUpdateContract={handleUpdateContract}
          onDeleteContract={handleDeleteContract}
        />
      </div>
    </MainLayout>
  );
};

export default Contracts;
