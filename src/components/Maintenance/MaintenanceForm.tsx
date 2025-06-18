import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { determineResponsibility } from './utils/responsibilityUtils';
import { useTranslation } from 'react-i18next';

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
  const { properties, loading: propertiesLoading } = useFirebaseProperties();
  const { tenants, loading: tenantsLoading } = useFirebaseTenants();
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();
  
  const [formData, setFormData] = useState<MaintenanceFormData>({
    propertyId: '',
    tenantName: '',
    category: '',
    priority: '',
    description: '',
    location: '',
    requestDate: new Date().toISOString().split('T')[0]
  });

  const [availableTenants, setAvailableTenants] = useState<Array<{id: string, name: string, type: string}>>([]);

  // Mettre à jour la liste des locataires/colocataires quand la propriété change
  useEffect(() => {
    if (formData.propertyId) {
      const selectedProperty = properties.find(p => p.title === formData.propertyId);
      
      if (selectedProperty) {
        let propertyTenants: Array<{id: string, name: string, type: string}> = [];
        
        if (selectedProperty.locationType === 'Location') {
          // Pour les locations classiques, chercher les locataires
          const propertyTenantsList = tenants.filter(tenant => 
            tenant.property === selectedProperty.title
          );
          propertyTenants = propertyTenantsList.map(tenant => ({
            id: tenant.id,
            name: tenant.name,
            type: 'Locataire'
          }));
        } else if (selectedProperty.locationType === 'Colocation') {
          // Pour les colocations, chercher les colocataires
          const propertyRoommatesList = roommates.filter(roommate => 
            roommate.property === selectedProperty.title
          );
          propertyTenants = propertyRoommatesList.map(roommate => ({
            id: roommate.id,
            name: roommate.name,
            type: 'Colocataire'
          }));
        }
        
        setAvailableTenants(propertyTenants);
      }
    } else {
      setAvailableTenants([]);
    }
    
    // Reset du locataire sélectionné quand la propriété change
    setFormData(prev => ({ ...prev, tenantName: '' }));
  }, [formData.propertyId, properties, tenants, roommates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      status: t('maintenance.statuses.pending'),
      responsibility: determineResponsibility(formData.category)
    };

    onSubmit(newRequest);
    setFormData({
      propertyId: '',
      tenantName: '',
      category: '',
      priority: '',
      description: '',
      location: '',
      requestDate: new Date().toISOString().split('T')[0]
    });

    toast({
      title: t('maintenance.requestSaved'),
      description: t('maintenance.requestSavedDescription'),
    });
  };

  // Filtrer tous les biens immobiliers (pas seulement ceux loués)
  const availableProperties = properties.filter(property => 
    property.locationType === 'Location' || property.locationType === 'Colocation'
  );

  console.log('Properties loaded:', properties.length);
  console.log('Available properties for maintenance:', availableProperties.length);
  console.log('Properties loading state:', propertiesLoading);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyId">{t('maintenance.propertyField')}</Label>
          <Select value={formData.propertyId} onValueChange={(value) => setFormData({...formData, propertyId: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={propertiesLoading ? t('maintenance.loadingProperties') : t('maintenance.selectProperty')} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
              {propertiesLoading ? (
                <SelectItem value="loading" disabled>{t('maintenance.loadingProperties')}</SelectItem>
              ) : availableProperties.length > 0 ? (
                availableProperties.map((property) => (
                  <SelectItem key={property.id} value={property.title} className="hover:bg-gray-100">
                    <div className="flex flex-col">
                      <span className="font-medium">{property.title}</span>
                      <span className="text-sm text-gray-500">{property.address} - {property.locationType}</span>
                      <span className="text-xs text-gray-400">Status: {property.status}</span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-properties" disabled>{t('maintenance.noPropertiesFound')}</SelectItem>
              )}
            </SelectContent>
          </Select>
          {formData.propertyId && (
            <p className="text-sm text-blue-600">
              {t('maintenance.propertySelected')} {properties.find(p => p.title === formData.propertyId)?.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantName">{t('maintenance.tenantField')}</Label>
          <Select 
            value={formData.tenantName} 
            onValueChange={(value) => setFormData({...formData, tenantName: value})}
            disabled={!formData.propertyId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !formData.propertyId 
                  ? t('maintenance.selectPropertyFirst')
                  : t('maintenance.selectTenant')
              } />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {(tenantsLoading || roommatesLoading) ? (
                <SelectItem value="loading" disabled>{t('maintenance.loadingTenants')}</SelectItem>
              ) : availableTenants.length > 0 ? (
                availableTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.name}>
                    {tenant.name} ({tenant.type})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-tenants" disabled>
                  {formData.propertyId ? t('maintenance.noTenantsForProperty') : t('maintenance.firstSelectProperty')}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t('maintenance.categoryField')}</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('maintenance.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Plomberie">{t('maintenance.categories.plumbing')}</SelectItem>
              <SelectItem value="Électricité">{t('maintenance.categories.electricity')}</SelectItem>
              <SelectItem value="Chauffage">{t('maintenance.categories.heating')}</SelectItem>
              <SelectItem value="Peinture">{t('maintenance.categories.painting')}</SelectItem>
              <SelectItem value="Serrurerie">{t('maintenance.categories.locksmith')}</SelectItem>
              <SelectItem value="Ménage">{t('maintenance.categories.cleaning')}</SelectItem>
              <SelectItem value="Autre">{t('maintenance.categories.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">{t('maintenance.priorityField')}</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('maintenance.selectPriority')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">{t('maintenance.priorities.urgent')}</SelectItem>
              <SelectItem value="normal">{t('maintenance.priorities.normal')}</SelectItem>
              <SelectItem value="faible">{t('maintenance.priorities.low')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t('maintenance.locationField')}</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder={t('maintenance.locationPlaceholder')}
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requestDate">{t('maintenance.requestDateField')}</Label>
          <Input
            id="requestDate"
            type="date"
            value={formData.requestDate}
            onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('maintenance.descriptionField')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder={t('maintenance.descriptionPlaceholder')}
          className="min-h-[100px] w-full resize-none"
          required
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto sm:min-w-[200px]">
        <span className="truncate">{t('maintenance.submitRequest')}</span>
      </Button>
    </form>
  );
};

export default MaintenanceForm;
