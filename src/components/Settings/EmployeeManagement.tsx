
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useEmployeePassword } from '@/hooks/useEmployeePassword';
import { useToast } from '@/hooks/use-toast';
import EmployeePasswordDialog from './EmployeePasswordDialog';
import EmployeeDialogs from './components/EmployeeDialogs';
import EmployeeManagementTabs from './components/EmployeeManagementTabs';
import { useEmployeeOperations } from './hooks/useEmployeeOperations';
import { Employee } from './types/employee';
import { useTranslation } from 'react-i18next';

const EmployeeManagement: React.FC = () => {
  const { t } = useTranslation();
  const { userRoles, loading, refetch } = useFirebaseUserRoles();
  const { companies, loading: companiesLoading } = useFirebaseCompanies();
  const { ensureEmployeeCanLogin } = useEmployeePassword();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedEmployee,
    setSelectedEmployee,
    formData,
    setFormData,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    openEditDialog
  } = useEmployeeOperations(refetch);

  // Convert UserRole to Employee type
  const employees: Employee[] = userRoles.map(user => ({
    ...user,
    role: user.role as 'admin' | 'owner'
  }));

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
    return t('settings.owners.noPermissions');
  };

  const getCompanyName = (companyId?: string): string => {
    if (!companyId) return t('settings.owners.noCompany');
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : t('settings.owners.unknownCompany');
  };

  if (loading || companiesLoading) {
    return <div>{t('settings.owners.loading')}</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg md:text-xl">
            <div className="flex items-center gap-2">
              👥 {t('settings.owners.management')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm md:text-base">
              {t('settings.owners.description')}
            </p>
            <EmployeeDialogs
              isAddDialogOpen={isAddDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              formData={formData}
              setFormData={setFormData}
              selectedEmployee={selectedEmployee}
              companies={companies}
              onAddSubmit={handleAddEmployee}
              onEditSubmit={handleEditEmployee}
              onPasswordClick={openPasswordDialog}
            />
          </div>

          <EmployeeManagementTabs
            employees={employees}
            companies={companies}
            onEdit={openEditDialog}
            onDelete={handleDeleteEmployee}
            onPasswordClick={openPasswordDialog}
            onActivateAccess={handleActivateAccess}
            getPermissionsDisplay={getPermissionsDisplay}
            getCompanyName={getCompanyName}
            onRefetchEmployees={refetch}
          />
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
