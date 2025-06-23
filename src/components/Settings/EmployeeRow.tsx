import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Lock, Eye } from 'lucide-react';
import { Company } from '@/hooks/useFirebaseCompanies';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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

interface EmployeeRowProps {
  employee: Employee;
  companies: Company[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onPasswordClick: (employee: Employee) => void;
  getPermissionsDisplay: (permissions: any) => string;
  getCompanyName: (companyId?: string) => string;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  companies,
  onEdit,
  onDelete,
  onPasswordClick,
  getPermissionsDisplay,
  getCompanyName
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAccessOwnerSpace = () => {
    // Create owner profile for admin access
    const ownerProfile = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      type: 'employee',
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
    <>
      {/* Mobile view */}
      <div className="md:hidden space-y-3 p-4 border border-gray-200 rounded-lg mb-4">
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={handleAccessOwnerSpace}
              className="text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium text-left"
              title={`Accéder à l'espace de ${employee.name}`}
            >
              {employee.name}
            </button>
            <p className="text-sm text-gray-600">
              {employee.role === 'admin' ? t('employees.administrator') : t('employees.employee')}
            </p>
            <p className="text-sm text-gray-500">{getCompanyName(employee.companyId)}</p>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAccessOwnerSpace}
              title={`Accéder à l'espace de ${employee.name}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPasswordClick(employee)}
              title={t('employees.managePassword')}
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(employee.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">{employee.email}</p>
          <p className="text-xs text-gray-500">
            {t('employees.createdOn')}: {new Date(employee.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {t('employees.password')}: {employee.hasPassword ? t('employees.passwordDefined') : t('employees.passwordNotDefined')}
          </p>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:grid grid-cols-8 gap-4 p-4 border-b border-gray-200">
        <div className="font-medium">
          <button
            onClick={handleAccessOwnerSpace}
            className="text-blue-600 hover:text-blue-800 hover:underline text-left font-medium"
            title={`Accéder à l'espace de ${employee.name}`}
          >
            {employee.name}
          </button>
        </div>
        <div className="text-sm text-gray-600 truncate">{employee.email}</div>
        <div className="text-sm text-gray-600">
          {employee.role === 'admin' ? t('employees.administrator') : t('employees.employee')}
        </div>
        <div className="text-sm text-gray-600">
          {getCompanyName(employee.companyId)}
        </div>
        <div className="text-sm text-gray-600">
          {new Date(employee.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-600">
          {getPermissionsDisplay(employee.permissions)}
        </div>
        <div className="text-sm text-gray-600">
          {employee.hasPassword ? (
            <span className="text-green-600">{t('employees.passwordDefined')}</span>
          ) : (
            <span className="text-red-600">{t('employees.passwordNotDefined')}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAccessOwnerSpace}
            title={`Accéder à l'espace de ${employee.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onPasswordClick(employee)}
            title={t('employees.managePassword')}
          >
            <Lock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(employee.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default EmployeeRow;
