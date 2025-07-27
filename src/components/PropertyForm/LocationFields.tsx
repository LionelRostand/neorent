
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const LocationFields = ({ formData, onInputChange }: LocationFieldsProps) => {
  const { t } = useTranslation();
  
  // Composant mis à jour avec champs d'adresse séparés
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="streetNumber">Numéro *</Label>
          <Input
            id="streetNumber"
            value={formData.streetNumber || ''}
            onChange={(e) => onInputChange('streetNumber', e.target.value)}
            placeholder="Ex: 721"
            required
          />
        </div>
        <div>
          <Label htmlFor="street">Rue *</Label>
          <Input
            id="street"
            value={formData.street || ''}
            onChange={(e) => onInputChange('street', e.target.value)}
            placeholder="Ex: Résidence de l'Aquitaine"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            value={formData.city || ''}
            onChange={(e) => onInputChange('city', e.target.value)}
            placeholder="Ex: Dammarie-les-Lys"
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Code postal *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode || ''}
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            placeholder="Ex: 77190"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="surface">{t('properties.surface')}</Label>
        <Input
          id="surface"
          value={formData.surface}
          onChange={(e) => onInputChange('surface', e.target.value)}
          placeholder={t('properties.surfacePlaceholder')}
        />
      </div>
    </>
  );
};

export default LocationFields;
