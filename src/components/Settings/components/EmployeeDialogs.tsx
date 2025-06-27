
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmployeeForm from '../EmployeeForm';
import { Employee, EmployeeFormData } from '../types/employee';
import { Company } from '@/hooks/useFirebaseCompanies';

interface EmployeeDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  selectedEmployee: Employee | null;
  companies: Company[];
  onAddSubmit: (e: React.FormEvent) => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onPasswordClick: (employee: Employee) => void;
}

const EmployeeDialogs: React.FC<EmployeeDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  formData,
  setFormData,
  selectedEmployee,
  companies,
  onAddSubmit,
  onEditSubmit,
  onPasswordClick
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('settings.owners.addOwner')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.owners.addOwner')}</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onAddSubmit}
            companies={companies}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('settings.owners.editOwner')}</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onEditSubmit}
            companies={companies}
            isEdit
            selectedEmployee={selectedEmployee}
            onPasswordClick={onPasswordClick}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeDialogs;
