
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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('contracts.title')}</h1>
        <p className="text-sm sm:text-base text-gray-600">{t('contracts.subtitle')}</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('contracts.addContract')}</span>
            <span className="sm:hidden">Nouveau Contrat</span>
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
