
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
        <Label htmlFor="title">Lease Contract Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Ex: Lease Contract - Villa Montparnasse..."
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Contract Type *</Label>
        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
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
        <Label htmlFor="provider">Service Provider</Label>
        <Input
          id="provider"
          value={formData.provider}
          onChange={(e) => handleInputChange('provider', e.target.value)}
          placeholder="Service provider name"
        />
      </div>

      <div>
        <Label htmlFor="jurisdiction">Jurisdiction *</Label>
        <Select value={formData.jurisdiction} onValueChange={(value) => handleInputChange('jurisdiction', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose jurisdiction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="francaise">French</SelectItem>
            <SelectItem value="camerounaise">Cameroonian</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicContractFields;
