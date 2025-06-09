
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Roommate {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  roomNumber: string;
  rentAmount: string;
  status: string;
  primaryTenant: string;
  moveInDate: string;
  image: string | null;
}

interface Property {
  id: string;
  title: string;
}

interface RoommateEditModalProps {
  roommate: Roommate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Roommate>) => void;
  properties: Property[];
}

const RoommateEditModal: React.FC<RoommateEditModalProps> = ({ roommate, isOpen, onClose, onSave, properties }) => {
  const [formData, setFormData] = useState<Partial<Roommate>>({});

  useEffect(() => {
    if (roommate) {
      setFormData(roommate);
    }
  }, [roommate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roommate && formData) {
      onSave(roommate.id, formData);
      onClose();
    }
  };

  if (!roommate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le colocataire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="property">Propriété</Label>
              <Select value={formData.property} onValueChange={(value) => setFormData({...formData, property: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.title}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">Numéro de chambre</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber || ''}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="rentAmount">Montant du loyer (€)</Label>
              <Input
                id="rentAmount"
                value={formData.rentAmount || ''}
                onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryTenant">Locataire principal</Label>
              <Input
                id="primaryTenant"
                value={formData.primaryTenant || ''}
                onChange={(e) => setFormData({...formData, primaryTenant: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="moveInDate">Date d'emménagement</Label>
            <Input
              id="moveInDate"
              type="date"
              value={formData.moveInDate || ''}
              onChange={(e) => setFormData({...formData, moveInDate: e.target.value})}
              required
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

export default RoommateEditModal;
