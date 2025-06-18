
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useContractForm } from '@/hooks/useContractForm';
import BasicContractFields from './ContractForm/BasicContractFields';
import PropertyFields from './ContractForm/PropertyFields';
import TenantFields from './ContractForm/TenantFields';
import DateAmountFields from './ContractForm/DateAmountFields';

interface ContractFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const ContractForm = ({ onClose, onSubmit }: ContractFormProps) => {
  const { t } = useTranslation();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.jurisdiction) {
      alert(t('contractForm.requiredFieldsError'));
      return;
    }

    const contractData = {
      ...formData,
      status: 'Draft',
      createdAt: new Date().toISOString()
    };

    try {
      await onSubmit(contractData);
      onClose();
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{t('contractForm.newContract')}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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

        <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">
            {t('contractForm.createContract')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ContractForm;
