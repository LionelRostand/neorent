
import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Employee, EmployeeFormData } from '../types/employee';

export const useEmployeeOperations = (refetch: () => void) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    role: 'owner',
    companyId: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'owner',
      companyId: ''
    });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const employeeId = `emp_${Date.now()}`;
      const newEmployee = {
        ...formData,
        createdAt: new Date().toISOString(),
        permissions: formData.role === 'admin' ? ['all'] : ['read']
      };

      await setDoc(doc(db, 'user_roles', employeeId), newEmployee);
      
      toast({
        title: t('common.success'),
        description: t('settings.owners.addSuccess'),
      });
      
      resetForm();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding owner:', error);
      toast({
        title: t('common.error'),
        description: t('settings.owners.addError'),
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) return;

    try {
      const updatedEmployee = {
        ...formData,
        createdAt: selectedEmployee.createdAt,
        permissions: formData.role === 'admin' ? ['all'] : ['read']
      };

      await setDoc(doc(db, 'user_roles', selectedEmployee.id), updatedEmployee, { merge: true });
      
      toast({
        title: t('common.success'),
        description: t('settings.owners.updateSuccess'),
      });
      
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      console.error('Error updating owner:', error);
      toast({
        title: t('common.error'),
        description: t('settings.owners.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm(t('settings.owners.confirmDelete'))) return;

    try {
      await deleteDoc(doc(db, 'user_roles', employeeId));
      
      toast({
        title: t('common.success'),
        description: t('settings.owners.deleteSuccess'),
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting owner:', error);
      toast({
        title: t('common.error'),
        description: t('settings.owners.deleteError'),
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      companyId: employee.companyId || ''
    });
    setIsEditDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedEmployee,
    setSelectedEmployee,
    formData,
    setFormData,
    resetForm,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    openEditDialog
  };
};
