
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import InspectionForm from '@/components/InspectionForm';

interface InspectionsHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onAddInspection: (data: any) => Promise<void>;
}

const InspectionsHeader = ({ isDialogOpen, setIsDialogOpen, onAddInspection }: InspectionsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('inspections.title')}</h1>
        <p className="text-gray-600 mt-2">{t('inspections.subtitle')}</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            {t('inspections.addInspection')}
          </Button>
        </DialogTrigger>
        <InspectionForm
          onClose={() => setIsDialogOpen(false)}
          onSubmit={onAddInspection}
        />
      </Dialog>
    </div>
  );
};

export default InspectionsHeader;
