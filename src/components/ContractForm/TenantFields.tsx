
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TenantFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  isBailContract: boolean;
  getAvailableTenants: () => any[];
  isDataLoading: boolean;
  tenants: any[];
  roommates: any[];
}

const TenantFields = ({ 
  formData, 
  handleInputChange, 
  isBailContract, 
  getAvailableTenants,
  isDataLoading,
  tenants,
  roommates
}: TenantFieldsProps) => {
  const { t } = useTranslation();

  if (!isBailContract) return null;

  return (
    <div>
      <Label htmlFor="tenant">{t('contractForm.tenant', 'Locataire')}</Label>
      <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
        <SelectTrigger>
          <SelectValue placeholder={isDataLoading ? t('common.loading', 'Chargement...') : t('contractForm.selectTenant', 'Sélectionner un locataire')} />
        </SelectTrigger>
        <SelectContent>
          {getAvailableTenants().map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.name}>
              {tenant.name} ({tenant.type})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantFields;
