
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier l'État des Lieux</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="État des lieux d'entrée">État des lieux d'entrée</SelectItem>
                  <SelectItem value="État des lieux de sortie">État des lieux de sortie</SelectItem>
                  <SelectItem value="Inspection périodique">Inspection périodique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenant">Locataire</Label>
              <Input
                id="tenant"
                value={formData.tenant}
                onChange={(e) => handleChange('tenant', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="property">Propriété</Label>
              <Input
                id="property"
                value={formData.property}
                onChange={(e) => handleChange('property', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">Numéro de chambre (optionnel)</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => handleChange('roomNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inspector">Inspecteur</Label>
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
                  <SelectValue placeholder="Sélectionner un statut" />
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
            <Label htmlFor="contractType">Type de contrat</Label>
            <Select value={formData.contractType} onValueChange={(value) => handleChange('contractType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Location classique">Location classique</SelectItem>
                <SelectItem value="Colocation">Colocation</SelectItem>
                <SelectItem value="Location meublée">Location meublée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionEditModal;
