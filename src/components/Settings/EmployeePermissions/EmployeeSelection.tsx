
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/hooks/useFirebaseCompanies';

interface UserRole {
  id: string;
  role: 'admin' | 'employee';
  email: string;
  name: string;
  createdAt: string;
  companyId?: string;
}

interface EmployeeSelectionProps {
  employees: UserRole[];
  selectedEmployeeId: string;
  selectedEmployee: UserRole | undefined;
  companies: Company[];
  onEmployeeSelect: (employeeId: string) => void;
}

const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({
  employees,
  selectedEmployeeId,
  selectedEmployee,
  companies,
  onEmployeeSelect
}) => {
  const getCompanyName = (companyId?: string): string => {
    if (!companyId) return 'Non assigné';
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Entreprise inconnue';
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="employee-select">Sélectionner un employé</Label>
        <Select value={selectedEmployeeId} onValueChange={onEmployeeSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un employé..." />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} ({employee.email}) - {getCompanyName(employee.companyId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEmployee && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Informations de l'employé sélectionné:</h3>
          <p className="text-sm text-gray-600">
            <strong>Nom:</strong> {selectedEmployee.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {selectedEmployee.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Entreprise:</strong> {getCompanyName(selectedEmployee.companyId)}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelection;
