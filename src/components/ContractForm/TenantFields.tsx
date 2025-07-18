
import React from 'react';
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
  return (
    <>
      {isBailContract && (
        <div>
          <Label htmlFor="tenant">
            {formData.type === 'Bail locatif' ? 'Tenant *' : 'Roommate *'}
          </Label>
          <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
            <SelectTrigger>
              <SelectValue placeholder={
                isDataLoading ? "Loading..." : 
                `Select a ${formData.type === 'Bail locatif' ? 'tenant' : 'roommate'}`
              } />
            </SelectTrigger>
            <SelectContent>
              {getAvailableTenants().map((tenant) => (
                <SelectItem key={tenant.id} value={`${tenant.name} (${tenant.type})`}>
                  {tenant.name} ({tenant.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isBailContract && (
        <div>
          <Label htmlFor="tenant">Tenant/Roommate *</Label>
          <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isDataLoading ? "Loading..." : "Select a tenant"} />
            </SelectTrigger>
            <SelectContent>
              {[...tenants.map(t => ({ id: t.id, name: t.name, type: 'Tenant' })), 
                ...roommates.map(r => ({ id: r.id, name: r.name, type: 'Roommate' }))].map((tenant) => (
                <SelectItem key={tenant.id} value={`${tenant.name} (${tenant.type})`}>
                  {tenant.name} ({tenant.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default TenantFields;
