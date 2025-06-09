
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

const mockProperties = [
  { 
    id: 1, 
    name: 'Appartement Rue des Fleurs', 
    type: 'Location',
    tenant: 'Marie Dubois'
  },
  { 
    id: 2, 
    name: 'Villa Montparnasse', 
    type: 'Location',
    tenant: 'Jean Martin'
  },
  { 
    id: 3, 
    name: 'Appartement Bastille - Chambre 1', 
    type: 'Colocation',
    tenant: 'Sophie Leroy'
  },
  { 
    id: 4, 
    name: 'Appartement Bastille - Chambre 2', 
    type: 'Colocation',
    tenant: 'Pierre Durand'
  },
];

interface PropertySelectorProps {
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
}

const PropertySelector = ({ selectedProperty, onPropertyChange }: PropertySelectorProps) => {
  const selectedPropertyData = mockProperties.find(p => p.id.toString() === selectedProperty);

  return (
    <div className="space-y-2">
      <Label htmlFor="property">Bien immobilier</Label>
      <Select value={selectedProperty} onValueChange={onPropertyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un bien" />
        </SelectTrigger>
        <SelectContent>
          {mockProperties.map((property) => (
            <SelectItem key={property.id} value={property.id.toString()}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{property.name} - {property.type}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedPropertyData && (
        <p className="text-sm text-gray-600">
          Locataire: {selectedPropertyData.tenant}
        </p>
      )}
    </div>
  );
};

export default PropertySelector;
export { mockProperties };
