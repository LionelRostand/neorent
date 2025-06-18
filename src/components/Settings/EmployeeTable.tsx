
import React from 'react';
import EmployeeRow from './EmployeeRow';
import { Company } from '@/hooks/useFirebaseCompanies';
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

interface EmployeeTableProps {
  employees: Employee[];
  companies: Company[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onPasswordClick: (employee: Employee) => void;
  getPermissionsDisplay: (permissions: any) => string;
  getCompanyName: (companyId?: string) => string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  companies,
  onEdit,
  onDelete,
  onPasswordClick,
  getPermissionsDisplay,
  getCompanyName
}) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="hidden md:grid grid-cols-8 gap-4 p-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700">
          <div>{t('employees.name')}</div>
          <div>{t('employees.email')}</div>
          <div>{t('employees.role')}</div>
          <div>{t('employees.company')}</div>
          <div>{t('employees.creationDate')}</div>
          <div>{t('employees.permissions')}</div>
          <div>{t('employees.passwordStatus')}</div>
          <div>{t('employees.actions')}</div>
        </div>
        
        {employees.map((employee) => (
          <EmployeeRow
            key={employee.id}
            employee={employee}
            companies={companies}
            onEdit={onEdit}
            onDelete={onDelete}
            onPasswordClick={onPasswordClick}
            getPermissionsDisplay={getPermissionsDisplay}
            getCompanyName={getCompanyName}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeTable;
