
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmployeeTable from '../EmployeeTable';
import OwnerRegistrations from '../OwnerRegistrations';
import { Employee } from '../types/employee';
import { Company } from '@/hooks/useFirebaseCompanies';

interface EmployeeManagementTabsProps {
  employees: Employee[];
  companies: Company[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onPasswordClick: (employee: Employee) => void;
  onActivateAccess: (employee: Employee) => void;
  getPermissionsDisplay: (permissions: any) => string;
  getCompanyName: (companyId?: string) => string;
}

const EmployeeManagementTabs: React.FC<EmployeeManagementTabsProps> = ({
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

  return (
    <Tabs defaultValue="owners" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="owners" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('settings.owners.management')}
        </TabsTrigger>
        <TabsTrigger value="requests" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          {t('settings.ownerRegistrations.title')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="owners" className="space-y-4">
        <EmployeeTable
          employees={employees}
          companies={companies}
          onEdit={onEdit}
          onDelete={onDelete}
          onPasswordClick={onPasswordClick}
          onActivateAccess={onActivateAccess}
          getPermissionsDisplay={getPermissionsDisplay}
          getCompanyName={getCompanyName}
        />
      </TabsContent>
      
      <TabsContent value="requests">
        <OwnerRegistrations />
      </TabsContent>
    </Tabs>
  );
};

export default EmployeeManagementTabs;
