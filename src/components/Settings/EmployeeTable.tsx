
import React from 'react';
import EmployeeRow from './EmployeeRow';
import { Company } from '@/hooks/useFirebaseCompanies';

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
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="hidden md:grid grid-cols-8 gap-4 p-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700">
          <div>Nom</div>
          <div>Email</div>
          <div>Rôle</div>
          <div>Entreprise</div>
          <div>Date création</div>
          <div>Permissions</div>
          <div>Mot de passe</div>
          <div>Actions</div>
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
