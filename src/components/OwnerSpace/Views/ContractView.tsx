
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useContractsActions } from '@/hooks/useContractsActions';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import ContractForm from '@/components/ContractForm';
import PropertyListTable from '@/components/OwnerSpace/PropertyListTable';

interface ContractViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const ContractView: React.FC<ContractViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewContractDialogOpen, setIsNewContractDialogOpen] = useState(false);
  const { handleAddContract } = useContractsActions();

  return (
    <div className="space-y-6">
      {/* Contract metrics */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="contract" />
      
      {/* New Contract button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Contract Management</h3>
        <Dialog open={isNewContractDialogOpen} onOpenChange={setIsNewContractDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Contract
            </Button>
          </DialogTrigger>
          <ContractForm
            onClose={() => setIsNewContractDialogOpen(false)}
            onSubmit={async (data) => {
              await handleAddContract(data);
              setIsNewContractDialogOpen(false);
            }}
          />
        </Dialog>
      </div>
      
      {/* Properties table with contract view */}
      <PropertyListTable ownerProfile={currentProfile} viewType="contract" />
    </div>
  );
};

export default ContractView;
