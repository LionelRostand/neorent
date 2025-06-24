
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface PropertyQuickSelectorProps {
  selectedPropertyToAdd: string;
  setSelectedPropertyToAdd: (value: string) => void;
  availablePropertiesForSelect: any[];
  loadingProperties: boolean;
  uniqueProperties: any[];
  ownerProperties: any[];
  allAdminProperties: any[];
  onDirectPropertyAdd: (propertyId: string) => void;
}

export const PropertyQuickSelector = ({
  selectedPropertyToAdd,
  setSelectedPropertyToAdd,
  availablePropertiesForSelect,
  loadingProperties,
  uniqueProperties,
  ownerProperties,
  allAdminProperties,
  onDirectPropertyAdd
}: PropertyQuickSelectorProps) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-medium text-blue-900 mb-3">
        Ajouter une propriété au site web
      </h4>
      <div className="flex gap-2">
        <div className="flex-1">
          <Select 
            value={selectedPropertyToAdd} 
            onValueChange={setSelectedPropertyToAdd}
            disabled={loadingProperties || availablePropertiesForSelect.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                loadingProperties 
                  ? "Chargement des propriétés..." 
                  : availablePropertiesForSelect.length === 0
                  ? "Toutes les propriétés sont déjà ajoutées"
                  : "Sélectionner une propriété"
              } />
            </SelectTrigger>
            <SelectContent>
              {availablePropertiesForSelect.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{property.title}</span>
                    <span className="text-sm text-gray-500">
                      - {property.address} ({property.rent}€/mois)
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => onDirectPropertyAdd(selectedPropertyToAdd)}
          disabled={!selectedPropertyToAdd || loadingProperties}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
      <p className="text-xs text-blue-700 mt-2">
        Sélectionnez une propriété dans la liste pour l'ajouter rapidement au site web
      </p>
      <div className="mt-3 text-xs text-gray-600">
        <strong>Total des propriétés disponibles:</strong> {uniqueProperties.length} 
        ({ownerProperties?.length || 0} propriétaire + {allAdminProperties?.length || 0} admin)
      </div>
    </div>
  );
};
