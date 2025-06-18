
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EmployeePermissions, MenuPermission, menuLabels } from '../types/permissions';
import { useTranslation } from 'react-i18next';

interface PermissionManagerProps {
  permissions: EmployeePermissions;
  selectedEmployeeId: string;
  onPermissionChange: (
    menu: keyof EmployeePermissions,
    permissionType: keyof MenuPermission,
    value: boolean
  ) => void;
  onSetAllPermissions: (value: boolean) => void;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({
  permissions,
  selectedEmployeeId,
  onPermissionChange,
  onSetAllPermissions
}) => {
  const { t } = useTranslation();

  if (!selectedEmployeeId) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSetAllPermissions(true)}
        >
          {t('settings.permissions.allowAll')}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSetAllPermissions(false)}
        >
          {t('settings.permissions.denyAll')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(menuLabels).map(([menuKey, menuLabel]) => (
          <Card key={menuKey} className="p-4">
            <h3 className="font-medium text-sm mb-3">{menuLabel}</h3>
            <div className="space-y-3">
              {Object.entries(permissions[menuKey as keyof EmployeePermissions]).map(([permType, value]) => (
                <div key={permType} className="flex items-center justify-between">
                  <Label className="text-xs capitalize">
                    {permType === 'read' && `📖 ${t('settings.permissions.read')}`}
                    {permType === 'write' && `✏️ ${t('settings.permissions.write')}`}
                    {permType === 'view' && `👁️ ${t('settings.permissions.view')}`}
                    {permType === 'delete' && `🗑️ ${t('settings.permissions.delete')}`}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      onPermissionChange(
                        menuKey as keyof EmployeePermissions,
                        permType as keyof MenuPermission,
                        checked
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PermissionManager;
