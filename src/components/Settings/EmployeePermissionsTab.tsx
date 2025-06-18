
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { Save, UserCheck } from 'lucide-react';
import { EmployeePermissions, MenuPermission, defaultEmployeePermissions } from './types/permissions';
import EmployeeSelection from './EmployeePermissions/EmployeeSelection';
import PermissionManager from './EmployeePermissions/PermissionManager';
import { usePermissionOperations } from './EmployeePermissions/usePermissionOperations';
import { useTranslation } from 'react-i18next';

const EmployeePermissionsTab: React.FC = () => {
  const { t } = useTranslation();
  const { userRoles, loading, refetch } = useFirebaseUserRoles();
  const { companies, loading: companiesLoading } = useFirebaseCompanies();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [permissions, setPermissions] = useState<EmployeePermissions>(defaultEmployeePermissions);
  
  const { isSaving, savePermissions, setAllPermissions: createAllPermissions } = usePermissionOperations(refetch);

  const employees = userRoles.filter(user => user.role === 'employee');
  const selectedEmployee = userRoles.find(user => user.id === selectedEmployeeId);

  React.useEffect(() => {
    if (selectedEmployee) {
      const employeePermissions = (selectedEmployee as any).detailedPermissions || defaultEmployeePermissions;
      setPermissions(employeePermissions);
    }
  }, [selectedEmployee]);

  const handlePermissionChange = (
    menu: keyof EmployeePermissions,
    permissionType: keyof MenuPermission,
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [menu]: {
        ...prev[menu],
        [permissionType]: value
      }
    }));
  };

  const handleSavePermissions = async () => {
    await savePermissions(selectedEmployeeId, permissions);
  };

  const handleSetAllPermissions = (value: boolean) => {
    const newPermissions = createAllPermissions(value);
    setPermissions(newPermissions);
  };

  if (loading || companiesLoading) {
    return <div>{t('settings.permissions.loading')}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {t('settings.permissions.title')}
          </div>
          <Button 
            onClick={handleSavePermissions}
            disabled={!selectedEmployeeId || isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? t('settings.permissions.saving') : t('settings.permissions.save')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <EmployeeSelection
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          selectedEmployee={selectedEmployee}
          companies={companies}
          onEmployeeSelect={setSelectedEmployeeId}
        />

        <PermissionManager
          permissions={permissions}
          selectedEmployeeId={selectedEmployeeId}
          onPermissionChange={handlePermissionChange}
          onSetAllPermissions={handleSetAllPermissions}
        />

        {employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('settings.permissions.noEmployees')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeePermissionsTab;
