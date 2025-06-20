
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
    <div className="space-y-2 sm:space-y-3">
      <Label htmlFor="tenant" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
        <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
        <span className="truncate">
          {selectedTenantData?.type === 'Colocataire' ? t('rentManagement.roommate') : t('rentManagement.tenant')}
        </span>
        <span className="text-red-500">*</span>
      </Label>
      <Select value={selectedTenant} onValueChange={onTenantChange}>
        <SelectTrigger className="h-10 sm:h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors text-sm sm:text-base">
          <SelectValue placeholder={t('rentManagement.selectTenant')} />
        </SelectTrigger>
        <SelectContent className="max-h-60 w-full">
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id} className="py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="p-1 sm:p-1.5 bg-blue-100 rounded-full flex-shrink-0">
                  <User className="h-2 w-2 sm:h-3 sm:w-3 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{tenant.name}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantSelector;
