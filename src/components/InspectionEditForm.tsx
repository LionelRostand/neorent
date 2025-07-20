
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';
import { Inspection } from '@/types/inspection';

interface InspectionEditFormProps {
  inspection: Inspection;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: any) => void;
}

const InspectionEditForm = ({ inspection, isOpen, onClose, onSave }: InspectionEditFormProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    status: inspection.status,
    description: inspection.description || '',
    observations: inspection.observations || ''
  });

  const [rooms, setRooms] = useState({
    salon: { state: 'Bon', observations: '' },
    cuisine: { state: 'Bon', observations: '' },
    chambre1: { state: 'Bon', observations: '' },
    salleDeBain: { state: 'Bon', observations: '' },
    wc: { state: 'Bon', observations: '' },
    entree: { state: 'Bon', observations: '' }
  });

  const [equipments, setEquipments] = useState({
    electromenager: { present: false, state: 'Bon', observations: '' },
    chauffage: { present: false, state: 'Bon', observations: '' },
    plomberie: { present: false, state: 'Bon', observations: '' },
    electricite: { present: false, state: 'Bon', observations: '' }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoomChange = (room: string, field: string, value: any) => {
    setRooms(prev => ({
      ...prev,
      [room]: { ...prev[room], [field]: value }
    }));
  };

  const handleEquipmentChange = (equipment: string, field: string, value: any) => {
    setEquipments(prev => ({
      ...prev,
      [equipment]: { ...prev[equipment], [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      status: formData.status,
      description: formData.description,
      observations: formData.observations,
      roomsData: JSON.stringify(rooms),
      equipmentsData: JSON.stringify(equipments),
      lastModified: new Date().toISOString()
    };

    onSave(inspection.id, updatedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('inspections.editInspection')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('inspections.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">{t('inspections.status')}</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planifié">{t('inspections.planned')}</SelectItem>
                      <SelectItem value="En cours">{t('inspections.inProgress')}</SelectItem>
                      <SelectItem value="Terminé">{t('inspections.completed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('inspections.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="observations">{t('inspections.observations')}</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rooms Inspection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('inspections.roomsInspection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(rooms).map(([roomKey, roomData]) => (
                <div key={roomKey} className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium capitalize">{roomKey.replace(/([A-Z])/g, ' $1')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('inspections.condition')}</Label>
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
                      <Label>{t('inspections.observations')}</Label>
                      <Input
                        value={roomData.observations}
                        onChange={(e) => handleRoomChange(roomKey, 'observations', e.target.value)}
                        placeholder={t('inspections.addObservations')}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Equipment Inspection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('inspections.equipmentInspection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(equipments).map(([equipmentKey, equipmentData]) => (
                <div key={equipmentKey} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={equipmentData.present}
                      onCheckedChange={(checked) => handleEquipmentChange(equipmentKey, 'present', checked)}
                    />
                    <h4 className="font-medium capitalize">{equipmentKey.replace(/([A-Z])/g, ' $1')}</h4>
                  </div>
                  
                  {equipmentData.present && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                      <div>
                        <Label>{t('inspections.condition')}</Label>
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
                        <Label>{t('inspections.observations')}</Label>
                        <Input
                          value={equipmentData.observations}
                          onChange={(e) => handleEquipmentChange(equipmentKey, 'observations', e.target.value)}
                          placeholder={t('inspections.addObservations')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionEditForm;
