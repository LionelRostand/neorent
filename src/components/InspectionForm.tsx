
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

interface InspectionFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const InspectionForm = ({ onClose, onSubmit }: InspectionFormProps) => {
  const { properties } = useFirebaseProperties();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    contractType: '',
    tenant: '',
    property: '',
    propertyType: '',
    roomNumber: '',
    date: '',
    inspector: '',
    description: '',
    observations: ''
  });

  const [availableTenants, setAvailableTenants] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  // Mettre à jour la liste des locataires/colocataires quand la propriété change
  useEffect(() => {
    if (formData.property) {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
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
        
        // Mettre à jour le type de contrat automatiquement
        const newContractType = selectedProperty.locationType === 'Colocation' ? 'Bail colocatif' : 'Bail locatif';
        setFormData(prev => ({ ...prev, contractType: newContractType }));
      }
    } else {
      setAvailableTenants([]);
    }
    
    // Reset du locataire sélectionné quand la propriété change
    setFormData(prev => ({ ...prev, tenant: '' }));
  }, [formData.property, properties, tenants, roommates]);

  // Mettre à jour les chambres disponibles pour les colocations
  useEffect(() => {
    if (formData.property && formData.contractType === 'Bail colocatif') {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
      if (selectedProperty && selectedProperty.locationType === 'Colocation') {
        // Générer la liste des chambres basée sur totalRooms
        const rooms = [];
        for (let i = 1; i <= (selectedProperty.totalRooms || 0); i++) {
          rooms.push(`Chambre ${i}`);
        }
        setAvailableRooms(rooms);
      } else {
        setAvailableRooms([]);
      }
    } else {
      setAvailableRooms([]);
    }
    
    // Reset de la chambre sélectionnée
    setFormData(prev => ({ ...prev, roomNumber: '' }));
  }, [formData.property, formData.contractType, properties]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.contractType || !formData.tenant || !formData.property) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const inspectionData = {
      ...formData,
      id: Date.now(),
      status: 'Planifié'
    };

    console.log('État des lieux ajouté à la collection rent_etat:', inspectionData);
    
    onSubmit(inspectionData);
    onClose();
  };

  const isColocatifContract = formData.contractType === 'Bail colocatif';

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Nouvel État des Lieux</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="Ex: État des lieux entrée Marie Dubois"
            />
          </div>

          <div>
            <Label htmlFor="type">Type d'état des lieux *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrée">État des lieux d'entrée</SelectItem>
                <SelectItem value="Sortie">État des lieux de sortie</SelectItem>
                <SelectItem value="Intermédiaire">État des lieux intermédiaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="property">Bien immobilier *</Label>
            <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bien" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.title}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contractType">Type de contrat</Label>
            <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Automatique selon le bien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bail locatif">Bail locatif</SelectItem>
                <SelectItem value="Bail colocatif">Bail colocatif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tenant">
              {formData.contractType === 'Bail locatif' ? 'Locataire *' : 'Colocataire *'}
            </Label>
            <Select 
              value={formData.tenant} 
              onValueChange={(value) => handleInputChange('tenant', value)}
              disabled={!formData.property}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.property 
                    ? "Sélectionner d'abord un bien" 
                    : `Sélectionner un ${formData.contractType === 'Bail locatif' ? 'locataire' : 'colocataire'}`
                } />
              </SelectTrigger>
              <SelectContent>
                {availableTenants.length > 0 ? (
                  availableTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.name}>
                      {tenant.name} ({tenant.type})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-tenants" disabled>
                    {formData.property ? "Aucun locataire pour ce bien" : "Sélectionner d'abord un bien"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {isColocatifContract && formData.property && (
            <div>
              <Label htmlFor="roomNumber">Chambre</Label>
              <Select value={formData.roomNumber} onValueChange={(value) => handleInputChange('roomNumber', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une chambre" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="inspector">Inspecteur *</Label>
            <Input
              id="inspector"
              value={formData.inspector}
              onChange={(e) => handleInputChange('inspector', e.target.value)}
              required
              placeholder="Nom de l'inspecteur"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description de l'état des lieux..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="observations">Observations</Label>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            placeholder="Observations particulières..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Créer l'état des lieux
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default InspectionForm;
