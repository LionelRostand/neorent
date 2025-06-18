
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
      status: 'En attente',
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
      title: "Demande enregistrée",
      description: "La demande de maintenance a été créée avec succès.",
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
          <Label htmlFor="propertyId">Bien Immobilier</Label>
          <Select value={formData.propertyId} onValueChange={(value) => setFormData({...formData, propertyId: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={propertiesLoading ? "Chargement des biens..." : "Sélectionner un bien immobilier"} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
              {propertiesLoading ? (
                <SelectItem value="loading" disabled>Chargement des propriétés...</SelectItem>
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
                <SelectItem value="no-properties" disabled>Aucun bien immobilier trouvé</SelectItem>
              )}
            </SelectContent>
          </Select>
          {formData.propertyId && (
            <p className="text-sm text-blue-600">
              Bien sélectionné: {properties.find(p => p.title === formData.propertyId)?.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantName">Nom du Locataire</Label>
          <Select 
            value={formData.tenantName} 
            onValueChange={(value) => setFormData({...formData, tenantName: value})}
            disabled={!formData.propertyId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !formData.propertyId 
                  ? "Sélectionner d'abord un bien" 
                  : "Sélectionner un locataire"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {(tenantsLoading || roommatesLoading) ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : availableTenants.length > 0 ? (
                availableTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.name}>
                    {tenant.name} ({tenant.type})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-tenants" disabled>
                  {formData.propertyId ? "Aucun locataire pour ce bien" : "Sélectionner d'abord un bien"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type de maintenance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Plomberie">Plomberie</SelectItem>
              <SelectItem value="Électricité">Électricité</SelectItem>
              <SelectItem value="Chauffage">Chauffage</SelectItem>
              <SelectItem value="Peinture">Peinture</SelectItem>
              <SelectItem value="Serrurerie">Serrurerie</SelectItem>
              <SelectItem value="Ménage">Ménage</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Niveau de priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="faible">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Ex: Cuisine, Salon, Salle de bain..."
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requestDate">Date de la demande</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Décrivez le problème en détail..."
          className="min-h-[100px] w-full resize-none"
          required
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto sm:min-w-[200px]">
        <span className="truncate">Enregistrer la demande</span>
      </Button>
    </form>
  );
};

export default MaintenanceForm;
