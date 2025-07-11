
import React from 'react';
import { useTranslation } from 'react-i18next';
import ContractCard from './ContractCard';

interface Contract {
  id: string;
  title: string;
  type: string;
  provider: string;
  property: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
  tenant: string;
  jurisdiction: string;
}

interface ContractsListProps {
  contracts: Contract[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
  onViewDetails: (contract: Contract) => void;
  onSign: (contract: Contract) => void;
}

const ContractsList = ({ contracts, onEdit, onDelete, onViewDetails, onSign }: ContractsListProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="pt-2 sm:pt-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('contracts.contractList')}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
            onSign={onSign}
          />
        ))}
      </div>
    </>
  );
};

export default ContractsList;
