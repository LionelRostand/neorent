
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import ContractForm from '@/components/ContractForm';

interface ContractsHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onAddContract: (data: any) => Promise<void>;
}

const ContractsHeader = ({ isDialogOpen, setIsDialogOpen, onAddContract }: ContractsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('contracts.title')}</h1>
        <p className="text-gray-600 mt-2">{t('contracts.subtitle')}</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            {t('contracts.addContract')}
          </Button>
        </DialogTrigger>
        <ContractForm
          onClose={() => setIsDialogOpen(false)}
          onSubmit={onAddContract}
        />
      </Dialog>
    </div>
  );
};

export default ContractsHeader;
