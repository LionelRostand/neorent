
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { determineResponsibility } from './utils/responsibilityUtils';
import { useTranslation } from 'react-i18next';
import { useMaintenanceFormLogic } from './MaintenanceForm/useMaintenanceFormLogic';
import PropertySelector from './MaintenanceForm/PropertySelector';
import TenantSelector from './MaintenanceForm/TenantSelector';
import CategoryPriorityFields from './MaintenanceForm/CategoryPriorityFields';
import LocationDateFields from './MaintenanceForm/LocationDateFields';
import DescriptionField from './MaintenanceForm/DescriptionField';

interface MaintenanceFormData {
  propertyId: string;
  tenantName: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  requestDate: string;
}

interface MaintenanceFormProps {
  onSubmit: (formData: MaintenanceFormData) => void;
}

const MaintenanceForm = ({ onSubmit }: MaintenanceFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    formData,
    setFormData,
    availableTenants,
    properties,
    propertiesLoading,
    tenantsLoading,
    roommatesLoading,
    resetForm
  } = useMaintenanceFormLogic();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      status: t('maintenance.statuses.pending'),
      responsibility: determineResponsibility(formData.category)
    };

    onSubmit(newRequest);
    resetForm();

    toast({
      title: t('maintenance.requestSaved'),
      description: t('maintenance.requestSavedDescription'),
    });
  };

  console.log('Properties loaded:', properties.length);
  console.log('Properties loading state:', propertiesLoading);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PropertySelector
          value={formData.propertyId}
          onChange={(value) => setFormData({...formData, propertyId: value})}
          properties={properties}
          loading={propertiesLoading}
        />

        <TenantSelector
          value={formData.tenantName}
          onChange={(value) => setFormData({...formData, tenantName: value})}
          tenants={availableTenants}
          loading={tenantsLoading || roommatesLoading}
          propertySelected={!!formData.propertyId}
        />

        <CategoryPriorityFields
          category={formData.category}
          priority={formData.priority}
          onCategoryChange={(value) => setFormData({...formData, category: value})}
          onPriorityChange={(value) => setFormData({...formData, priority: value})}
        />

        <LocationDateFields
          location={formData.location}
          requestDate={formData.requestDate}
          onLocationChange={(value) => setFormData({...formData, location: value})}
          onRequestDateChange={(value) => setFormData({...formData, requestDate: value})}
        />
      </div>

      <DescriptionField
        value={formData.description}
        onChange={(value) => setFormData({...formData, description: value})}
      />

      <Button type="submit" className="w-full sm:w-auto sm:min-w-[200px]">
        <span className="truncate">{t('maintenance.submitRequest')}</span>
      </Button>
    </form>
  );
};

export default MaintenanceForm;
