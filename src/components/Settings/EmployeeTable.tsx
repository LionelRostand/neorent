
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Lock, CheckCircle, XCircle, UserPlus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/hooks/useFirebaseCompanies';
import { Employee } from './types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  companies: Company[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onPasswordClick: (employee: Employee) => void;
  onActivateAccess?: (employee: Employee) => void;
  getPermissionsDisplay: (permissions: any) => string;
  getCompanyName: (companyId?: string) => string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  companies,
  onEdit,
  onDelete,
  onPasswordClick,
  onActivateAccess,
  getPermissionsDisplay,
  getCompanyName
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAccessOwnerSpace = (employee: Employee) => {
    // Create owner profile for admin access
    const ownerProfile = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      type: 'owner',
      companyId: employee.companyId,
      permissions: employee.permissions
    };
    
    // Store the owner profile in sessionStorage for admin access
    sessionStorage.setItem('adminSelectedProfile', JSON.stringify(ownerProfile));
    
    console.log('Admin accessing owner space for:', employee.name);
    
    // Navigate to owner space
    navigate('/owner-space');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('settings.owners.fullName')}</TableHead>
            <TableHead>{t('common.email')}</TableHead>
            <TableHead>{t('settings.owners.role')}</TableHead>
            <TableHead>{t('settings.owners.company')}</TableHead>
            <TableHead>{t('settings.owners.creationDate')}</TableHead>
            <TableHead>{t('settings.owners.permissions')}</TableHead>
            <TableHead>{t('settings.owners.passwordStatus')}</TableHead>
            <TableHead>{t('settings.owners.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                <button
                  onClick={() => handleAccessOwnerSpace(employee)}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-left font-medium"
                  title={`Accéder à l'espace de ${employee.name}`}
                >
                  {employee.name}
                </button>
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  employee.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {employee.role === 'admin' ? t('settings.owners.administrator') : t('settings.owners.owner')}
                </span>
              </TableCell>
              <TableCell>{getCompanyName(employee.companyId)}</TableCell>
              <TableCell>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{getPermissionsDisplay(employee.permissions)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {employee.hasPassword ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{t('common.defined')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">{t('common.notDefined')}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAccessOwnerSpace(employee)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                    title={`Accéder à l'espace de ${employee.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(employee)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPasswordClick(employee)}
                    className="h-8 w-8 p-0"
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                  {!employee.hasPassword && onActivateAccess && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onActivateAccess(employee)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                      title={t('settings.owners.activateAccess')}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(employee.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
