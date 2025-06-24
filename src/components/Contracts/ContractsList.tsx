
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
          <div key={contract.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {contract.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{contract.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contract.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  contract.status === 'Signed' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contract.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="font-medium">Propriétaire:</span>
                  <span className="ml-2">{contract.provider}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="font-medium">Propriété:</span>
                  <span className="ml-2">{contract.property}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="font-medium">Locataire:</span>
                  <span className="ml-2">{contract.tenant}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="font-medium">Période:</span>
                  <span className="ml-2">
                    {new Date(contract.startDate).toLocaleDateString('fr-FR')} - {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  <span className="font-medium">Montant:</span>
                  <span className="ml-2">{contract.amount}/mois</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContractsList;
