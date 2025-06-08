
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { inspectionTypes, contractTypes } from '@/constants/inspectionData';
import { InspectionFormData } from '@/types/inspection';

interface BasicInfoFieldsProps {
  formData: InspectionFormData;
  onInputChange: (field: keyof InspectionFormData, value: string) => void;
}

const BasicInfoFields = ({ formData, onInputChange }: BasicInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre de l'état des lieux *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Ex: État des lieux d'entrée - Marie Dubois..."
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type d'état des lieux *</Label>
        <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            {inspectionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="contractType">Type de contrat *</Label>
        <Select value={formData.contractType} onValueChange={(value) => onInputChange('contractType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type de contrat" />
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
    </>
  );
};

export default BasicInfoFields;
