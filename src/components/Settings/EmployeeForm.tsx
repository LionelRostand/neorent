
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, Eye } from 'lucide-react';
import { Company } from '@/hooks/useFirebaseCompanies';

interface Employee {
  id: string;
  role: 'admin' | 'employee';
  email: string;
  name: string;
  companyId?: string;
  createdAt: string;
  permissions?: any;
  detailedPermissions?: any;
  hasPassword?: boolean;
}

interface EmployeeFormData {
  name: string;
  email: string;
  role: 'admin' | 'employee';
  companyId: string;
}

interface EmployeeFormProps {
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  companies: Company[];
  isEdit?: boolean;
  selectedEmployee?: Employee | null;
  onPasswordClick?: (employee: Employee) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  companies,
  isEdit = false,
  selectedEmployee,
  onPasswordClick
}) => {
  const { t } = useTranslation();

  const getPermissionStatus = (permissions: any) => {
    if (!permissions) return 'none';
    if (Array.isArray(permissions) && permissions.includes('all')) return 'all';
    if (typeof permissions === 'object' && Object.keys(permissions).length > 0) return 'detailed';
    return 'limited';
  };

  const renderPermissionsBadge = (status: string) => {
    switch (status) {
      case 'all':
        return <Badge className="bg-green-100 text-green-800">Tous les droits</Badge>;
      case 'detailed':
        return <Badge className="bg-blue-100 text-blue-800">Permissions personnalisées</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-100 text-yellow-800">Permissions limitées</Badge>;
      default:
        return <Badge variant="destructive">Aucune permission</Badge>;
    }
  };

  const renderDetailedPermissions = (detailedPermissions: any) => {
    if (!detailedPermissions || typeof detailedPermissions !== 'object') {
      return <p className="text-sm text-gray-500">Aucune permission détaillée configurée</p>;
    }

    const permissionEntries = Object.entries(detailedPermissions);
    const activePermissions = permissionEntries.filter(([_, perms]: [string, any]) => {
      if (typeof perms === 'object') {
        return Object.values(perms).some(val => val === true);
      }
      return false;
    });

    if (activePermissions.length === 0) {
      return <p className="text-sm text-red-600">⚠️ Aucune permission active trouvée</p>;
    }

    return (
      <div className="space-y-2">
        {activePermissions.map(([menu, perms]: [string, any]) => {
          const activeActions = Object.entries(perms).filter(([_, value]) => value === true);
          return (
            <div key={menu} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium capitalize">{menu}</span>
              <div className="flex gap-1">
                {activeActions.map(([action]) => (
                  <Badge key={action} variant="outline" className="text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">{t('employees.fullName')}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">{t('profile.email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="role">{t('employees.role')}</Label>
          <Select value={formData.role} onValueChange={(value: 'admin' | 'employee') => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">{t('employees.employee')}</SelectItem>
              <SelectItem value="admin">{t('employees.administrator')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="company">{t('employees.company')}</Label>
          <Select value={formData.companyId} onValueChange={(value: string) => setFormData({ ...formData, companyId: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t('employees.selectCompany')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('employees.noCompany')}</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEdit && selectedEmployee && onPasswordClick && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <Label className="font-medium">{t('employees.password')}</Label>
              <p className="text-sm text-gray-600">
                {selectedEmployee.hasPassword ? t('employees.passwordSet') : t('employees.passwordNotSet')}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPasswordClick(selectedEmployee)}
            >
              <Lock className="h-4 w-4 mr-2" />
              {selectedEmployee.hasPassword ? t('employees.changePassword') : t('employees.setPassword')}
            </Button>
          </div>
        )}
        
        <Button type="submit" className="w-full">
          {isEdit ? t('employees.editEmployee') : t('employees.addEmployee')}
        </Button>
      </form>

      {/* Affichage des permissions pour l'employé sélectionné */}
      {isEdit && selectedEmployee && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Permissions et Droits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Statut des permissions:</Label>
              {renderPermissionsBadge(getPermissionStatus(selectedEmployee.detailedPermissions || selectedEmployee.permissions))}
            </div>

            {selectedEmployee.role === 'admin' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Cet utilisateur est administrateur et possède tous les droits
                </p>
              </div>
            )}

            {selectedEmployee.role === 'employee' && (
              <>
                <div>
                  <Label className="font-medium flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    Permissions de base:
                  </Label>
                  <div className="text-sm">
                    {Array.isArray(selectedEmployee.permissions) && selectedEmployee.permissions.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {selectedEmployee.permissions.map((perm: string, index: number) => (
                          <Badge key={index} variant="outline">{perm}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-600">⚠️ Aucune permission de base configurée</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="font-medium flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    Permissions détaillées:
                  </Label>
                  {renderDetailedPermissions(selectedEmployee.detailedPermissions)}
                </div>

                {(!selectedEmployee.permissions || selectedEmployee.permissions.length === 0) && 
                 (!selectedEmployee.detailedPermissions || Object.keys(selectedEmployee.detailedPermissions).length === 0) && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      ❌ Cet employé n'a aucune permission configurée. Veuillez configurer ses permissions dans l'onglet "Permissions".
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeForm;
