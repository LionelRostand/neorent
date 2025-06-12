
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  tenant: string | null;
  locationType: string;
  totalRooms?: number;
  availableRooms?: number;
  charges?: Record<string, any>;
}

interface PropertySelectorProps {
  properties: Property[];
  selectedProperties: string[];
  onPropertyToggle: (propertyId: string) => void;
}

const PropertySelector = ({ properties, selectedProperties, onPropertyToggle }: PropertySelectorProps) => {
  if (properties.length === 0) {
    return (
      <div className="space-y-4">
        <Label>Sélection des biens immobiliers</Label>
        <div className="text-center py-8 text-gray-500">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>Aucun bien immobilier trouvé</p>
          <p className="text-sm">Ajoutez d'abord des biens dans le menu Propriétés</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>Sélection des biens immobiliers</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property) => {
          const monthlyRent = parseFloat(property.rent) || 0;
          const isColocation = property.locationType === 'Colocation';
          const propertyMonthlyCharges = property.charges ? 
            Object.values(property.charges).reduce((sum: number, charge: any) => {
              return sum + (parseFloat(String(charge)) || 0);
            }, 0) : 0;
          
          return (
            <Card 
              key={property.id} 
              className={`cursor-pointer border-2 transition-colors ${
                selectedProperties.includes(property.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPropertyToggle(property.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {isColocation ? <Users className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      <h4 className="font-medium text-sm">{property.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{property.address}</p>
                    <p className="text-sm text-gray-600">
                      Type: {property.type} - {property.surface}m²
                    </p>
                    <p className="text-sm text-gray-600">
                      Locataire: {property.tenant || 'Libre'}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-blue-600">
                        Loyer: {monthlyRent.toLocaleString('fr-FR')}€/mois
                      </p>
                      {propertyMonthlyCharges > 0 && (
                        <p className="text-sm text-orange-600">
                          Charges: {propertyMonthlyCharges.toLocaleString('fr-FR')}€/mois
                        </p>
                      )}
                      <p className="text-sm font-semibold text-green-600">
                        Net: {(monthlyRent - propertyMonthlyCharges).toLocaleString('fr-FR')}€/mois
                      </p>
                    </div>
                    {isColocation && (
                      <p className="text-xs text-gray-500">
                        Colocation: {property.availableRooms}/{property.totalRooms} chambres disponibles
                      </p>
                    )}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => onPropertyToggle(property.id)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PropertySelector;
