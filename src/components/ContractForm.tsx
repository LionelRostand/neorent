
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useContractForm } from '@/hooks/useContractForm';
import BasicContractFields from './ContractForm/BasicContractFields';
import PropertyFields from './ContractForm/PropertyFields';
import TenantFields from './ContractForm/TenantFields';
import DateAmountFields from './ContractForm/DateAmountFields';

interface ContractFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ContractForm = ({ onClose, onSubmit }: ContractFormProps) => {
  const {
    formData,
    handleInputChange,
    contractTypes,
    getAvailableProperties,
    getAvailableTenants,
    getAvailableRooms,
    isBailContract,
    isColocatifContract,
    isDataLoading,
    tenants,
    roommates
  } = useContractForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.tenant || !formData.jurisdiction) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const contractData = {
      ...formData,
      id: Date.now(),
      status: 'Actif'
    };

    console.log('Contrat de bail ajouté à la collection rent_contrats:', contractData);
    
    // Simuler la génération et le stockage du PDF
    const pdfDocument = {
      id: Date.now(),
      name: `Contrat_${formData.type.replace(' ', '_')}_${formData.tenant.split(' ')[0]}.pdf`,
      type: 'contrat_bail',
      uploadDate: new Date().toISOString(),
      contractId: contractData.id
    };
    
    console.log('Document PDF généré et stocké:', pdfDocument);
    
    onSubmit(contractData);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Nouveau Contrat de Bail</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BasicContractFields
            formData={formData}
            handleInputChange={handleInputChange}
            contractTypes={contractTypes}
          />

          <PropertyFields
            formData={formData}
            handleInputChange={handleInputChange}
            isBailContract={isBailContract}
            getAvailableProperties={getAvailableProperties}
            getAvailableRooms={getAvailableRooms}
            isColocatifContract={isColocatifContract}
            isDataLoading={isDataLoading}
          />

          <TenantFields
            formData={formData}
            handleInputChange={handleInputChange}
            isBailContract={isBailContract}
            getAvailableTenants={getAvailableTenants}
            isDataLoading={isDataLoading}
            tenants={tenants}
            roommates={roommates}
          />

          <DateAmountFields
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isDataLoading}>
            Créer le contrat de bail
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ContractForm;
