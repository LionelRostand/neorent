
export interface Employee {
  id: string;
  role: 'admin' | 'owner';
  email: string;
  name: string;
  companyId?: string;
  createdAt: string;
  permissions?: any;
  hasPassword?: boolean;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  role: 'admin' | 'owner';
  companyId: string;
}
