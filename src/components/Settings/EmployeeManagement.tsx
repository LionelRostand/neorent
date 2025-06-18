
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { Plus } from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import EmployeePasswordDialog from './EmployeePasswordDialog';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';

interface Employee {
  id: string;
  role: 'admin' | 'employee';
  email: string;
  name: string;
  companyId?: string;
  createdAt: string;
  permissions?: any;
  hasPassword?: boolean;
}

interface EmployeeFormData {
  name: string;
  email: string;
  role: 'admin' | 'employee';
  companyId: string;
}

const EmployeeManagement: React.FC = () => {
  const { userRoles, loading, refetch } = useFirebaseUserRoles();
  const { companies, loading: companiesLoading } = useFirebaseCompanies();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    role: 'employee',
    companyId: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'employee',
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
        title: "Succès",
        description: "Employé ajouté avec succès",
      });
      
      resetForm();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'employé",
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
        title: "Succès",
        description: "Employé modifié avec succès",
      });
      
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de l'employé",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;

    try {
      await deleteDoc(doc(db, 'user_roles', employeeId));
      
      toast({
        title: "Succès",
        description: "Employé supprimé avec succès",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'employé",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      companyId: (employee as any).companyId || ''
    });
    setIsEditDialogOpen(true);
  };

  const openPasswordDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSet = () => {
    refetch();
  };

  const getPermissionsDisplay = (permissions: any): string => {
    if (Array.isArray(permissions)) {
      return permissions.join(', ');
    }
    return 'Aucune';
  };

  const getCompanyName = (companyId?: string): string => {
    if (!companyId) return 'Non assigné';
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Entreprise inconnue';
  };

  if (loading || companiesLoading) {
    return <div>Chargement des employés...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg md:text-xl">
            <div className="flex items-center gap-2">
              👥 Gestion des Employés
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un employé
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un employé</DialogTitle>
                </DialogHeader>
                <EmployeeForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleAddEmployee}
                  companies={companies}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <p className="text-gray-600 text-sm md:text-base">
            Gérez les comptes employés de votre entreprise
          </p>

          <EmployeeTable
            employees={userRoles}
            companies={companies}
            onEdit={openEditDialog}
            onDelete={handleDeleteEmployee}
            onPasswordClick={openPasswordDialog}
            getPermissionsDisplay={getPermissionsDisplay}
            getCompanyName={getCompanyName}
          />

          {/* Dialog de modification */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Modifier l'employé</DialogTitle>
              </DialogHeader>
              <EmployeeForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleEditEmployee}
                companies={companies}
                isEdit
                selectedEmployee={selectedEmployee}
                onPasswordClick={openPasswordDialog}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Dialog de gestion des mots de passe */}
      {selectedEmployee && (
        <EmployeePasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          employee={selectedEmployee}
          onPasswordSet={handlePasswordSet}
        />
      )}
    </>
  );
};

export default EmployeeManagement;
