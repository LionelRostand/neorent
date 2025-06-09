
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface PropertySelectorProps {
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
}

const PropertySelector = ({ selectedProperty, onPropertyChange }: PropertySelectorProps) => {
  const { properties, loading } = useFirebaseProperties();

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label htmlFor="property">Bien immobilier</Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="property">Bien immobilier</Label>
      <Select value={selectedProperty} onValueChange={onPropertyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un bien" />
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{property.title} - {property.locationType}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedPropertyData && (
        <p className="text-sm text-gray-600">
          Locataire: {selectedPropertyData.tenant || 'Aucun locataire'}
        </p>
      )}
    </div>
  );
};

export default PropertySelector;
