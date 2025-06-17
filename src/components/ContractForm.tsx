
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

interface ContractFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ContractForm = ({ onClose, onSubmit }: ContractFormProps) => {
  const { properties } = useFirebaseProperties();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    provider: '',
    property: '',
    roomNumber: '',
    startDate: '',
    endDate: '',
    amount: '',
    tenant: '',
    jurisdiction: '',
    description: ''
  });

  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [availableTenants, setAvailableTenants] = useState<Array<{id: string, name: string, type: string}>>([]);

  // Mettre à jour les chambres disponibles quand la propriété change
  useEffect(() => {
    if (formData.property && formData.type === 'Bail colocatif') {
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
  }, [formData.property, formData.type, properties]);

  // Mettre à jour les locataires/colocataires disponibles
  useEffect(() => {
    if (formData.type === 'Bail locatif') {
      setAvailableTenants(tenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        type: 'Locataire'
      })));
    } else if (formData.type === 'Bail colocatif') {
      setAvailableTenants(roommates.map(roommate => ({
        id: roommate.id,
        name: roommate.name,
        type: 'Colocataire'
      })));
    } else {
      setAvailableTenants([]);
    }
  }, [formData.type, tenants, roommates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contractData = {
      ...formData,
      status: 'Actif'
    };
    
    onSubmit(contractData);
    onClose();
  };

  const contractTypes = ['Bail locatif', 'Bail colocatif'];

  const getAvailableProperties = () => {
    if (formData.type === 'Bail locatif') {
      return properties.filter(property => property.locationType === 'Location');
    }
    if (formData.type === 'Bail colocatif') {
      return properties.filter(property => property.locationType === 'Colocation');
    }
    return properties;
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nouveau Contrat de Bail</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre du contrat *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: Bail Marie Dubois"
            />
          </div>

          <div>
            <Label htmlFor="type">Type de contrat *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.type && (
            <div>
              <Label htmlFor="property">Bien immobilier *</Label>
              <Select value={formData.property} onValueChange={(value) => setFormData({ ...formData, property: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableProperties().map((property) => (
                    <SelectItem key={property.id} value={property.title}>
                      {property.title} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.type === 'Bail colocatif' && formData.property && (
            <div>
              <Label htmlFor="roomNumber">Chambre *</Label>
              <Select value={formData.roomNumber} onValueChange={(value) => setFormData({ ...formData, roomNumber: value })}>
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

          {formData.type && (
            <div>
              <Label htmlFor="tenant">
                {formData.type === 'Bail locatif' ? 'Locataire *' : 'Colocataire *'}
              </Label>
              <Select value={formData.tenant} onValueChange={(value) => setFormData({ ...formData, tenant: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={`Sélectionner un ${formData.type === 'Bail locatif' ? 'locataire' : 'colocataire'}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.name}>
                      {tenant.name} ({tenant.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="startDate">Date de début *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">Date de fin *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Montant (€) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              placeholder="Ex: 1200"
            />
          </div>

          <div>
            <Label htmlFor="jurisdiction">Juridiction</Label>
            <Input
              id="jurisdiction"
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              placeholder="Ex: Paris"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description du contrat..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Créer le contrat
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ContractForm;
