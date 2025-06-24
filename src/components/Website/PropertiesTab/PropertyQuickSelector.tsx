
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building } from 'lucide-react';

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
    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-5 w-5 text-blue-600" />
        <h4 className="text-lg font-semibold text-blue-900">
          Ajouter des propriétés au site web
        </h4>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Statistiques des propriétés disponibles */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-gray-600 mb-1">Propriétés Propriétaire</div>
          <div className="text-2xl font-bold text-blue-600">{ownerProperties?.length || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-gray-600 mb-1">Propriétés Admin</div>
          <div className="text-2xl font-bold text-indigo-600">{allAdminProperties?.length || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Disponibles</div>
          <div className="text-2xl font-bold text-green-600">{uniqueProperties.length}</div>
        </div>
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Sélectionner une propriété à ajouter
          </label>
          <Select 
            value={selectedPropertyToAdd} 
            onValueChange={setSelectedPropertyToAdd}
            disabled={loadingProperties || availablePropertiesForSelect.length === 0}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={
                loadingProperties 
                  ? "Chargement des propriétés..." 
                  : availablePropertiesForSelect.length === 0
                  ? "Toutes les propriétés sont déjà ajoutées"
                  : "Choisir une propriété dans la liste complète"
              } />
            </SelectTrigger>
            <SelectContent>
              {availablePropertiesForSelect.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <Building className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{property.title}</div>
                      <div className="text-sm text-gray-500">
                        {property.address} • {property.rent}€/mois • {property.type}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => onDirectPropertyAdd(selectedPropertyToAdd)}
          disabled={!selectedPropertyToAdd || loadingProperties}
          size="lg"
          className="h-12 px-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter au site
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Information :</strong> Ce champ liste toutes les propriétés disponibles depuis le menu "Propriétés" du sidebar Neorent 
          (propriétaires + admin). Sélectionnez une propriété pour l'ajouter rapidement au site web public.
        </p>
      </div>
    </div>
  );
};
