
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface Tenant {
  id: string;
  name: string;
  type: string;
}

interface TenantSelectorProps {
  value: string;
  onChange: (value: string) => void;
  tenants: Tenant[];
  loading: boolean;
  propertySelected: boolean;
}

const TenantSelector = ({ value, onChange, tenants, loading, propertySelected }: TenantSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="tenantName">{t('maintenance.tenantField')}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={!propertySelected}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            !propertySelected 
              ? t('maintenance.selectPropertyFirst')
              : t('maintenance.selectTenant')
          } />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {loading ? (
            <SelectItem value="loading" disabled>{t('maintenance.loadingTenants')}</SelectItem>
          ) : tenants.length > 0 ? (
            tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.name}>
                {tenant.name} ({tenant.type})
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-tenants" disabled>
              {propertySelected ? t('maintenance.noTenantsForProperty') : t('maintenance.firstSelectProperty')}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantSelector;
