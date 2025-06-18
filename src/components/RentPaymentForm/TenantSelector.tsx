
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Tenant {
  id: string;
  name: string;
  type: string;
  property: string;
  rentAmount: number;
}

interface TenantSelectorProps {
  selectedTenant: string;
  onTenantChange: (tenantId: string) => void;
  tenants: Tenant[];
  selectedTenantData?: Tenant;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({
  selectedTenant,
  onTenantChange,
  tenants,
  selectedTenantData
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <Label htmlFor="tenant" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <User className="h-4 w-4 text-blue-600" />
        {selectedTenantData?.type === 'Colocataire' ? t('rentManagement.roommate') : t('rentManagement.tenant')} 
        <span className="text-red-500">*</span>
      </Label>
      <Select value={selectedTenant} onValueChange={onTenantChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
          <SelectValue placeholder={t('rentManagement.selectTenant')} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id} className="py-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900">{tenant.name}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantSelector;
