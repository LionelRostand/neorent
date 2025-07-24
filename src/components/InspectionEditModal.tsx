import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

  useEffect(() => {
    if (formData.property) {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
      if (selectedProperty && selectedProperty.locationType === 'Colocation') {
        const rooms = [];
        for (let i = 1; i <= (selectedProperty.totalRooms || 0); i++) {
          rooms.push(`${t('inspections.room')} ${i}`);
        }
        setAvailableRooms(rooms);
      } else {
        setAvailableRooms([]);
      }
    } else {
      setAvailableRooms([]);
    }
  }, [formData.property, properties, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inspection) {
      console.log('=== SAVING INSPECTION EDITS ===');
      console.log('Inspection ID:', inspection.id);
      console.log('Form data to save:', formData);
      
      try {
        await onSave(inspection.id, formData);
        console.log('✅ Modifications sauvegardées avec succès');
        onClose();
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        // Ne pas fermer la modale si la sauvegarde échoue
      }
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
          <DialogTitle>{t('inspections.modifyInspection')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{t('inspections.inspectionTitle')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">{t('inspections.inspectionType')} *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('inspections.selectInspectionType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrée">{t('inspections.entryInspection')}</SelectItem>
                  <SelectItem value="Sortie">{t('inspections.exitInspection')}</SelectItem>
                  <SelectItem value="Intermédiaire">{t('inspections.intermediateInspection')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contractType">{t('inspections.contractType')} *</Label>
              <Select value={formData.contractType} onValueChange={(value) => handleChange('contractType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('inspections.contractType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bail locatif">{t('inspections.rentalLease')}</SelectItem>
                  <SelectItem value="Bail colocatif">{t('inspections.colocationLease')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property">{t('inspections.property')} *</Label>
              <Select value={formData.property} onValueChange={(value) => handleChange('property', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('inspections.selectProperty')} />
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
                <Label htmlFor="roomNumber">{t('inspections.room')}</Label>
                <Select value={formData.roomNumber} onValueChange={(value) => handleChange('roomNumber', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('inspections.selectRoom')} />
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
                {formData.contractType === 'Bail locatif' ? `${t('inspections.tenant')} *` : `${t('inspections.roommate')} *`}
              </Label>
              <Input
                id="tenant"
                value={formData.tenant}
                onChange={(e) => handleChange('tenant', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">{t('inspections.date')} *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="inspector">{t('inspections.inspector')} *</Label>
              <Input
                id="inspector"
                value={formData.inspector}
                onChange={(e) => handleChange('inspector', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">{t('inspections.status')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('inspections.status')} />
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
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('inspections.descriptionPlaceholder')}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="observations">{t('inspections.observations')}</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder={t('inspections.observationsPlaceholder')}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('inspections.cancel')}
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {t('inspections.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionEditModal;
