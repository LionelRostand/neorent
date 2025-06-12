
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';

export const useContractsActions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [signingContract, setSigningContract] = useState(null);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [detailsContract, setDetailsContract] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { contracts, loading, error, addContract, updateContract, deleteContract } = useFirebaseContracts();
  const { toast } = useToast();

  const activeCount = contracts.filter(c => c.status === 'Actif').length;
  const expiredCount = contracts.filter(c => c.status === 'Expiré').length;
  const totalCount = contracts.length;

  const handleAddContract = async (data: any) => {
    try {
      await addContract(data);
      toast({
        title: "Succès",
        description: "Le contrat a été ajouté avec succès.",
      });
      console.log('Contrat ajouté à la collection Rent_contracts:', data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du contrat:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du contrat.",
        variant: "destructive",
      });
    }
  };

  const handleEditContract = (contract: any) => {
    setEditingContract(contract);
    setIsEditModalOpen(true);
  };

  const handleUpdateContract = async (id: string, updates: any) => {
    try {
      await updateContract(id, updates);
      toast({
        title: "Succès",
        description: "Le contrat a été modifié avec succès.",
      });
      console.log('Contrat modifié dans la collection Rent_contracts:', { id, updates });
    } catch (err) {
      console.error('Erreur lors de la modification du contrat:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du contrat.",
        variant: "destructive",
      });
    }
  };

  const handleSignContract = (contract: any) => {
    setSigningContract(contract);
    setIsSigningModalOpen(true);
  };

  const handleSigningComplete = async (contractId: string, signatures: any) => {
    try {
      await updateContract(contractId, { 
        signatures,
        signedDate: new Date().toISOString(),
        status: 'Signé'
      });
      toast({
        title: "Succès",
        description: "Le contrat a été signé par toutes les parties.",
      });
      setIsSigningModalOpen(false);
      console.log('Contrat signé dans la collection Rent_contracts:', { contractId, signatures });
    } catch (err) {
      console.error('Erreur lors de la signature du contrat:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la signature du contrat.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('ID du contrat invalide:', id);
      toast({
        title: "Erreur",
        description: "ID du contrat invalide. Impossible de supprimer.",
        variant: "destructive",
      });
      return;
    }

    const contractExists = contracts.find(contract => contract.id === id);
    if (!contractExists) {
      console.error('Contrat non trouvé dans la liste locale:', id);
      toast({
        title: "Erreur",
        description: "Contrat non trouvé. Veuillez actualiser la page.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      try {
        console.log('Tentative de suppression du contrat avec ID:', id);
        await deleteContract(id);
        toast({
          title: "Succès",
          description: "Le contrat a été supprimé avec succès.",
        });
        console.log('Contrat supprimé de la collection Rent_contracts:', id);
      } catch (err) {
        console.error('Erreur détaillée lors de la suppression du contrat:', err);
        toast({
          title: "Erreur",
          description: `Erreur lors de la suppression du contrat: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDetails = (contract: any) => {
    setDetailsContract(contract);
    setIsDetailsModalOpen(true);
  };

  return {
    // State
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
    
    // Actions
    handleAddContract,
    handleEditContract,
    handleUpdateContract,
    handleSignContract,
    handleSigningComplete,
    handleDeleteContract,
    handleViewDetails,
  };
};
