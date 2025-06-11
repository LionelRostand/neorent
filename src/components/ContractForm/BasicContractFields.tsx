
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicContractFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  contractTypes: string[];
}

const BasicContractFields = ({ formData, handleInputChange, contractTypes }: BasicContractFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre du contrat de bail *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Ex: Contrat de bail - Villa Montparnasse..."
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type de contrat *</Label>
        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
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

      <div>
        <Label htmlFor="provider">Prestataire</Label>
        <Input
          id="provider"
          value={formData.provider}
          onChange={(e) => handleInputChange('provider', e.target.value)}
          placeholder="Nom du prestataire"
        />
      </div>

      <div>
        <Label htmlFor="jurisdiction">Juridiction *</Label>
        <Select value={formData.jurisdiction} onValueChange={(value) => handleInputChange('jurisdiction', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir la juridiction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="francaise">Française</SelectItem>
            <SelectItem value="camerounaise">Camerounaise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicContractFields;
