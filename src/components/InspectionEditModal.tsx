
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface InspectionEditModalProps {
  inspection: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: any) => void;
}

const InspectionEditModal: React.FC<InspectionEditModalProps> = ({
  inspection,
  isOpen,
  onClose,
  onSave
}) => {
  const { properties } = useFirebaseProperties();
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    tenant: '',
    property: '',
    roomNumber: '',
    date: '',
    inspector: '',
    status: '',
    contractType: '',
    description: '',
    observations: ''
  });

  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  useEffect(() => {
    if (inspection) {
      setFormData({
        title: inspection.title || '',
        type: inspection.type || '',
        tenant: inspection.tenant || '',
        property: inspection.property || '',
        roomNumber: inspection.roomNumber || '',
        date: inspection.date || '',
        inspector: inspection.inspector || '',
        status: inspection.status || '',
        contractType: inspection.contractType || '',
        description: inspection.description || '',
        observations: inspection.observations || ''
      });
    }
  }, [inspection]);

  // Mettre à jour les chambres disponibles quand la propriété change
  useEffect(() => {
    if (formData.property) {
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
  }, [formData.property, properties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inspection) {
      onSave(inspection.id, formData);
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!inspection) return null;

  const isColocatifContract = formData.contractType === 'Bail colocatif';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'État des Lieux</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'état des lieux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrée">État des lieux d'entrée</SelectItem>
                  <SelectItem value="Sortie">État des lieux de sortie</SelectItem>
                  <SelectItem value="Intermédiaire">État des lieux intermédiaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contractType">Type de contrat *</Label>
              <Select value={formData.contractType} onValueChange={(value) => handleChange('contractType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bail locatif">Bail locatif</SelectItem>
                  <SelectItem value="Bail colocatif">Bail colocatif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property">Bien immobilier *</Label>
              <Select value={formData.property} onValueChange={(value) => handleChange('property', value)}>
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

            {isColocatifContract && formData.property && (
              <div>
                <Label htmlFor="roomNumber">Chambre</Label>
                <Select value={formData.roomNumber} onValueChange={(value) => handleChange('roomNumber', value)}>
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
              <Label htmlFor="tenant">
                {formData.contractType === 'Bail locatif' ? 'Locataire *' : 'Colocataire *'}
              </Label>
              <Input
                id="tenant"
                value={formData.tenant}
                onChange={(e) => handleChange('tenant', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="inspector">Inspecteur *</Label>
              <Input
                id="inspector"
                value={formData.inspector}
                onChange={(e) => handleChange('inspector', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut de l'inspection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifié">Planifié</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de l'état des lieux..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observations particulières..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionEditModal;
