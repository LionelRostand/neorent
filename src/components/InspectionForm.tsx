import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

  useEffect(() => {
    if (formData.property) {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
      if (selectedProperty) {
        let propertyTenants: Array<{id: string, name: string, type: string}> = [];
        
        if (selectedProperty.locationType === 'Location') {
          const propertyTenantsList = tenants.filter(tenant => 
            tenant.property === selectedProperty.title
          );
          propertyTenants = propertyTenantsList.map(tenant => ({
            id: tenant.id,
            name: tenant.name,
            type: 'Locataire'
          }));
        } else if (selectedProperty.locationType === 'Colocation') {
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
        
        const newContractType = selectedProperty.locationType === 'Colocation' ? 'Bail colocatif' : 'Bail locatif';
        setFormData(prev => ({ ...prev, contractType: newContractType }));
      }
    } else {
      setAvailableTenants([]);
    }
    
    setFormData(prev => ({ ...prev, tenant: '' }));
  }, [formData.property, properties, tenants, roommates]);

  useEffect(() => {
    if (formData.property && formData.contractType === 'Bail colocatif') {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
      if (selectedProperty && selectedProperty.locationType === 'Colocation') {
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
    
    setFormData(prev => ({ ...prev, roomNumber: '' }));
  }, [formData.property, formData.contractType, properties]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.contractType || !formData.tenant || !formData.property) {
      alert(t('propertyForm.requiredFieldsError'));
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
        <DialogTitle className="text-xl font-bold">{t('inspections.newInspection')}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">{t('inspections.inspectionTitle')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder={t('inspections.inspectionTitlePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="type">{t('inspections.inspectionType')}</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
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
            <Label htmlFor="property">{t('inspections.property')}</Label>
            <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
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

          <div>
            <Label htmlFor="contractType">{t('inspections.contractType')}</Label>
            <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)} disabled>
              <SelectTrigger>
                <SelectValue placeholder={t('inspections.automaticByProperty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bail locatif">{t('inspections.rentalLease')}</SelectItem>
                <SelectItem value="Bail colocatif">{t('inspections.colocationLease')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tenant">
              {formData.contractType === 'Bail locatif' ? t('inspections.tenant') : t('inspections.roommate')}
            </Label>
            <Select 
              value={formData.tenant} 
              onValueChange={(value) => handleInputChange('tenant', value)}
              disabled={!formData.property}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.property 
                    ? t('inspections.selectPropertyFirst')
                    : formData.contractType === 'Bail locatif' 
                      ? t('inspections.selectTenant')
                      : t('inspections.selectRoommate')
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
                    {formData.property ? t('inspections.noTenantsForProperty') : t('inspections.selectPropertyFirst')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {isColocatifContract && formData.property && (
            <div>
              <Label htmlFor="roomNumber">{t('inspections.room')}</Label>
              <Select value={formData.roomNumber} onValueChange={(value) => handleInputChange('roomNumber', value)}>
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
            <Label htmlFor="date">{t('inspections.date')}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="inspector">{t('inspections.inspectorField')}</Label>
            <Input
              id="inspector"
              value={formData.inspector}
              onChange={(e) => handleInputChange('inspector', e.target.value)}
              required
              placeholder={t('inspections.inspectorPlaceholder')}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">{t('inspections.description')}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={t('inspections.descriptionPlaceholder')}
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="observations">{t('inspections.observations')}</Label>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            placeholder={t('inspections.observationsPlaceholder')}
            className="min-h-[80px]"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('inspections.cancel')}
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {t('inspections.createInspection')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default InspectionForm;
