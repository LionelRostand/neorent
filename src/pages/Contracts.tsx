import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Calendar, User, Building2, CheckCircle, Clock, XCircle, ScrollText, Edit, Trash2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import ContractForm from '@/components/ContractForm';
import ContractEditModal from '@/components/ContractEditModal';
import ContractSigningModal from '@/components/ContractSigning/ContractSigningModal';
import ContractDetailsModal from '@/components/ContractDetailsModal';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useToast } from '@/hooks/use-toast';

const Contracts = () => {
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
    // Validation de l'ID avant de procéder
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('ID du contrat invalide:', id);
      toast({
        title: "Erreur",
        description: "ID du contrat invalide. Impossible de supprimer.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier que le contrat existe dans la liste locale
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des contrats...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contrats de Baux</h1>
            <p className="text-gray-600 mt-2">Gérez vos contrats de baux et prestataires</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau contrat de bail
              </Button>
            </DialogTrigger>
            <ContractForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddContract}
            />
          </Dialog>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Contrats actifs"
            value={activeCount}
            description={`${activeCount} contrat${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="À renouveler"
            value={0}
            description="0 contrat à renouveler"
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="Expirés"
            value={expiredCount}
            description={`${expiredCount} contrat${expiredCount > 1 ? 's' : ''} expiré${expiredCount > 1 ? 's' : ''}`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} contrat${totalCount > 1 ? 's' : ''} au total`}
            icon={ScrollText}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste - maintenant après les métriques */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Contrats de Baux</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{contract.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{contract.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={contract.status === 'Actif' ? 'default' : contract.status === 'Signé' ? 'default' : 'destructive'}
                        className={
                          contract.status === 'Actif' ? 'bg-green-100 text-green-800' : 
                          contract.status === 'Signé' ? 'bg-blue-100 text-blue-800' : ''
                        }
                      >
                        {contract.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContract(contract)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContract(contract.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="mr-2 h-4 w-4" />
                      {contract.provider}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      {contract.property}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="mr-2 h-4 w-4" />
                      {contract.tenant}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Du {new Date(contract.startDate).toLocaleDateString('fr-FR')} au {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                      <FileText className="mr-2 h-4 w-4" />
                      {contract.amount}/an
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Juridiction {contract.jurisdiction}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(contract)}
                    >
                      Voir détails
                    </Button>
                    {contract.status !== 'Signé' ? (
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        onClick={() => handleSignContract(contract)}
                      >
                        Signer
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditContract(contract)}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
