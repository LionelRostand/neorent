import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useEmployeePassword } from '@/hooks/useEmployeePassword';
import { Plus, Users, UserPlus } from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import EmployeePasswordDialog from './EmployeePasswordDialog';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';
import OwnerRegistrations from './OwnerRegistrations';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { userRoles, loading, refetch } = useFirebaseUserRoles();
  const { companies, loading: companiesLoading } = useFirebaseCompanies();
  const { ensureEmployeeCanLogin } = useEmployeePassword();
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
        title: t('common.success'),
        description: t('employees.addSuccess'),
      });
      
      resetForm();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: t('common.error'),
        description: t('employees.addError'),
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
        description: t('employees.updateSuccess'),
      });
      
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: t('common.error'),
        description: t('employees.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm(t('employees.confirmDelete'))) return;

    try {
      await deleteDoc(doc(db, 'user_roles', employeeId));
      
      toast({
        title: t('common.success'),
        description: t('employees.deleteSuccess'),
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: t('common.error'),
        description: t('employees.deleteError'),
        variant: "destructive",
      });
    }
  };

  const handleActivateAccess = async (employee: Employee) => {
    try {
      const result = await ensureEmployeeCanLogin(employee.id, employee.email);
      
      if (result.success) {
        toast({
          title: t('common.success'),
          description: result.message + (result.tempPassword ? ` Mot de passe temporaire: ${result.tempPassword}` : ''),
        });
        refetch();
      } else {
        toast({
          title: t('common.error'),
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error activating access:', error);
      toast({
        title: t('common.error'),
        description: 'Erreur lors de l\'activation de l\'accès',
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
    return t('employees.noPermissions');
  };

  const getCompanyName = (companyId?: string): string => {
    if (!companyId) return t('employees.noCompany');
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : t('employees.unknownCompany');
  };

  if (loading || companiesLoading) {
    return <div>{t('employees.loading')}</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg md:text-xl">
            <div className="flex items-center gap-2">
              👥 {t('employees.management')}
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('employees.addEmployee')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('employees.addEmployee')}</DialogTitle>
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
            {t('employees.description')}
          </p>

          <Tabs defaultValue="employees" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Propriétaires
              </TabsTrigger>
              <TabsTrigger value="registrations" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Demandes d'inscription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="employees" className="space-y-4">
              <EmployeeTable
                employees={userRoles}
                companies={companies}
                onEdit={openEditDialog}
                onDelete={handleDeleteEmployee}
                onPasswordClick={openPasswordDialog}
                onActivateAccess={handleActivateAccess}
                getPermissionsDisplay={getPermissionsDisplay}
                getCompanyName={getCompanyName}
              />
            </TabsContent>
            
            <TabsContent value="registrations" className="space-y-4">
              <OwnerRegistrations />
            </TabsContent>
          </Tabs>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('employees.editEmployee')}</DialogTitle>
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

      {/* Password Management Dialog */}
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
