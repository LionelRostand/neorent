
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Save } from 'lucide-react';

interface InspectionDetails {
  id: number;
  title: string;
  type: string;
  tenant: string;
  property: string;
  roomNumber?: string;
  date: string;
  inspector: string;
  status: string;
  contractType?: string;
  description?: string;
  observations?: string;
}

interface InspectionEditFormProps {
  inspection: InspectionDetails;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const InspectionEditForm = ({ inspection, isOpen, onClose, onSave }: InspectionEditFormProps) => {
  const [formData, setFormData] = useState({
    status: inspection.status,
    description: inspection.description || '',
    observations: inspection.observations || '',
    rooms: {
      salon: { state: 'Bon', observations: '' },
      cuisine: { state: 'Bon', observations: '' },
      chambre1: { state: 'Bon', observations: '' },
      salleDeBain: { state: 'Bon', observations: '' },
      wc: { state: 'Bon', observations: '' },
      entree: { state: 'Bon', observations: '' }
    },
    equipments: {
      electromenager: { present: false, state: 'Bon', observations: '' },
      chauffage: { present: false, state: 'Bon', observations: '' },
      plomberie: { present: false, state: 'Bon', observations: '' },
      electricite: { present: false, state: 'Bon', observations: '' }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoomChange = (room: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [room]: { ...prev.rooms[room], [field]: value }
      }
    }));
  };

  const handleEquipmentChange = (equipment: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipments: {
        ...prev.equipments,
        [equipment]: { ...prev.equipments[equipment], [field]: value }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedInspection = {
      ...inspection,
      ...formData,
      lastModified: new Date().toISOString()
    };

    console.log('État des lieux mis à jour:', updatedInspection);
    onSave(updatedInspection);
    onClose();
  };

  const isColocatif = inspection.contractType === 'Bail colocatif' || inspection.tenant.includes('Colocataire');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Modifier l'État des Lieux - {inspection.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planifié">Planifié</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bien: {inspection.property}</Label>
                  {isColocatif && inspection.roomNumber && (
                    <p className="text-sm text-gray-600">Chambre: {inspection.roomNumber}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description générale de l'état des lieux..."
                />
              </div>
              
              <div>
                <Label htmlFor="observations">Observations générales</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Observations particulières..."
                />
              </div>
            </CardContent>
          </Card>

          {/* État des pièces */}
          <Card>
            <CardHeader>
              <CardTitle>État des Pièces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(formData.rooms).map(([roomKey, roomData]) => (
                <div key={roomKey} className="border p-4 rounded-lg">
                  <h4 className="font-medium mb-3">
                    {roomKey === 'salon' ? 'Salon' :
                     roomKey === 'cuisine' ? 'Cuisine' :
                     roomKey === 'chambre1' ? (isColocatif ? inspection.roomNumber || 'Chambre' : 'Chambre') :
                     roomKey === 'salleDeBain' ? 'Salle de bain' :
                     roomKey === 'wc' ? 'WC' : 'Entrée'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>État</Label>
                      <Select 
                        value={roomData.state} 
                        onValueChange={(value) => handleRoomChange(roomKey, 'state', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Bon">Bon</SelectItem>
                          <SelectItem value="Moyen">Moyen</SelectItem>
                          <SelectItem value="Mauvais">Mauvais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Observations</Label>
                      <Input
                        value={roomData.observations}
                        onChange={(e) => handleRoomChange(roomKey, 'observations', e.target.value)}
                        placeholder="Défauts, remarques..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Équipements */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(formData.equipments).map(([equipmentKey, equipmentData]) => (
                <div key={equipmentKey} className="border p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      checked={equipmentData.present}
                      onCheckedChange={(checked) => handleEquipmentChange(equipmentKey, 'present', checked)}
                    />
                    <h4 className="font-medium">
                      {equipmentKey === 'electromenager' ? 'Électroménager' :
                       equipmentKey === 'chauffage' ? 'Chauffage' :
                       equipmentKey === 'plomberie' ? 'Plomberie' : 'Électricité'}
                    </h4>
                  </div>
                  {equipmentData.present && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>État</Label>
                        <Select 
                          value={equipmentData.state} 
                          onValueChange={(value) => handleEquipmentChange(equipmentKey, 'state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Bon">Bon</SelectItem>
                            <SelectItem value="Moyen">Moyen</SelectItem>
                            <SelectItem value="Mauvais">Mauvais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Observations</Label>
                        <Input
                          value={equipmentData.observations}
                          onChange={(e) => handleEquipmentChange(equipmentKey, 'observations', e.target.value)}
                          placeholder="Défauts, remarques..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer l'état des lieux
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionEditForm;
