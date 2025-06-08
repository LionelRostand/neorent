
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InspectionFormData } from '@/types/inspection';

interface AdditionalInfoFieldsProps {
  formData: InspectionFormData;
  onInputChange: (field: keyof InspectionFormData, value: string) => void;
}

const AdditionalInfoFields = ({ formData, onInputChange }: AdditionalInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="date">Date de l'état des lieux *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onInputChange('date', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="inspector">Inspecteur</Label>
        <Input
          id="inspector"
          value={formData.inspector}
          onChange={(e) => onInputChange('inspector', e.target.value)}
          placeholder="Nom de l'inspecteur"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Description générale de l'état des lieux..."
          className="min-h-[80px]"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="observations">Observations</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => onInputChange('observations', e.target.value)}
          placeholder="Observations particulières, défauts constatés..."
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default AdditionalInfoFields;
