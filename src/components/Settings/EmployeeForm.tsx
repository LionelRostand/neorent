
import React from 'react';
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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select value={formData.role} onValueChange={(value: 'admin' | 'employee') => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employé</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="company">Entreprise</Label>
        <Select value={formData.companyId} onValueChange={(value: string) => setFormData({ ...formData, companyId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une entreprise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune entreprise</SelectItem>
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
            <Label className="font-medium">Mot de passe</Label>
            <p className="text-sm text-gray-600">
              {selectedEmployee.hasPassword ? 'Mot de passe défini' : 'Aucun mot de passe défini'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPasswordClick(selectedEmployee)}
          >
            <Lock className="h-4 w-4 mr-2" />
            {selectedEmployee.hasPassword ? 'Modifier' : 'Définir'}
          </Button>
        </div>
      )}
      
      <Button type="submit" className="w-full">
        {isEdit ? 'Modifier l\'employé' : 'Ajouter l\'employé'}
      </Button>
    </form>
  );
};

export default EmployeeForm;
