
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/hooks/useFirebaseCompanies';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const getCompanyName = (companyId?: string): string => {
    if (!companyId) return t('settings.permissions.noCompany');
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : t('settings.permissions.unknownCompany');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="employee-select">{t('settings.permissions.selectEmployee')}</Label>
        <Select value={selectedEmployeeId} onValueChange={onEmployeeSelect}>
          <SelectTrigger>
            <SelectValue placeholder={t('settings.permissions.chooseEmployee')} />
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
          <h3 className="font-medium text-sm mb-2">{t('settings.permissions.selectedEmployeeInfo')}</h3>
          <p className="text-sm text-gray-600">
            <strong>{t('settings.permissions.name')}:</strong> {selectedEmployee.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>{t('settings.permissions.email')}:</strong> {selectedEmployee.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>{t('settings.permissions.company')}:</strong> {getCompanyName(selectedEmployee.companyId)}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelection;
