
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock } from 'lucide-react';
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

  return (
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
  );
};

export default EmployeeForm;
