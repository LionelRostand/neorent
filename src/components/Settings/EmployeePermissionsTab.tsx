
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmployeeSelection from './EmployeePermissions/EmployeeSelection';
import PermissionManager from './EmployeePermissions/PermissionManager';
import { useEmployeePermissionsManagement } from '@/hooks/useEmployeePermissionsManagement';

const EmployeePermissionsTab: React.FC = () => {
  const { t } = useTranslation();
  const {
    employees,
    companies,
    selectedEmployeeId,
    selectedEmployee,
    permissions,
    loading,
    saving,
    setSelectedEmployeeId,
    updatePermissions,
    setAllPermissions,
    savePermissions
  } = useEmployeePermissionsManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('settings.permissions.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xl md:text-2xl font-semibold text-gray-900">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <span>🔐 {t('settings.permissions.title')}</span>
            </div>
            <Button 
              onClick={savePermissions} 
              disabled={saving || !selectedEmployeeId}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              size="sm"
            >
              <Save className="h-4 w-4" />
              <span className="whitespace-nowrap">
                {saving ? t('settings.permissions.saving') : t('settings.permissions.save')}
              </span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {t('settings.permissions.subtitle')}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeeSelection
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          selectedEmployee={selectedEmployee}
          companies={companies}
          onEmployeeSelect={setSelectedEmployeeId}
        />

        {selectedEmployeeId ? (
          <PermissionManager
            permissions={permissions}
            selectedEmployeeId={selectedEmployeeId}
            onPermissionChange={updatePermissions}
            onSetAllPermissions={setAllPermissions}
          />
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {employees.length === 0 
                  ? t('settings.permissions.noOwners')
                  : t('settings.permissions.selectOwner')
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeePermissionsTab;
