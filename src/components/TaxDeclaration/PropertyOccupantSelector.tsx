
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  rent: string;
  charges?: Record<string, any>;
  locationType?: string;
  tenant?: string | null;
}

interface Tenant {
  id: string;
  name: string;
  property: string;
  rentAmount: string;
}

interface Roommate {
  id: string;
  name: string;
  property: string;
  rentAmount: string;
}

interface PropertyOccupantSelectorProps {
  properties: Property[];
  tenants: Tenant[];
  roommates: Roommate[];
  selectedProperties: string[];
  onPropertyChange: (propertyId: string, checked: boolean) => void;
}

const PropertyOccupantSelector = ({ 
  properties, 
  tenants, 
  roommates, 
  selectedProperties, 
  onPropertyChange 
}: PropertyOccupantSelectorProps) => {
  
  // Fonction pour obtenir les occupants d'un bien
  const getPropertyOccupants = (propertyTitle: string) => {
    const propertyTenants = tenants.filter(t => t.property === propertyTitle);
    const propertyRoommates = roommates.filter(r => r.property === propertyTitle);
    
    return {
      tenants: propertyTenants,
      roommates: propertyRoommates,
      hasOccupants: propertyTenants.length > 0 || propertyRoommates.length > 0
    };
  };

  // Calculer le revenu annuel total d'un bien
  const getPropertyAnnualIncome = (property: Property) => {
    const monthlyRent = parseFloat(property.rent) || 0;
    const occupants = getPropertyOccupants(property.title);
    
    let totalMonthlyIncome = monthlyRent;
    
    // Ajouter les revenus des locataires
    occupants.tenants.forEach(tenant => {
      totalMonthlyIncome += parseFloat(tenant.rentAmount) || 0;
    });
    
    // Ajouter les revenus des colocataires
    occupants.roommates.forEach(roommate => {
      totalMonthlyIncome += parseFloat(roommate.rentAmount) || 0;
    });
    
    return totalMonthlyIncome * 12; // Calcul annuel
  };

  return (
    <div className="space-y-4">
      <Label>Sélectionner les biens et leurs occupants pour la déclaration</Label>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Appartements et Occupants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.map((property) => {
            const occupants = getPropertyOccupants(property.title);
            const annualIncome = getPropertyAnnualIncome(property);
            
            return (
              <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={`property-${property.id}`}
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) => onPropertyChange(property.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label htmlFor={`property-${property.id}`} className="text-base font-semibold cursor-pointer text-blue-800">
                        {property.title}
                      </label>
                      <p className="text-sm text-gray-600">
                        Type: {property.locationType || 'Location'} • Loyer base: {property.rent}€/mois
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        Revenu annuel total: {annualIncome.toLocaleString('fr-FR')}€
                      </p>
                    </div>
                    
                    {/* Affichage des occupants */}
                    {occupants.hasOccupants && (
                      <div className="bg-white rounded-md p-3 border">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Occupants :</span>
                        </div>
                        <div className="space-y-1">
                          {occupants.tenants.map((tenant) => (
                            <div key={tenant.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">📍 {tenant.name} (Locataire)</span>
                              <span className="text-green-600 font-medium">{tenant.rentAmount}€/mois</span>
                            </div>
                          ))}
                          {occupants.roommates.map((roommate) => (
                            <div key={roommate.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">🏠 {roommate.name} (Colocataire)</span>
                              <span className="text-green-600 font-medium">{roommate.rentAmount}€/mois</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!occupants.hasOccupants && (
                      <div className="bg-yellow-50 rounded-md p-2 border border-yellow-200">
                        <p className="text-sm text-yellow-700">Aucun occupant déclaré pour ce bien</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {properties.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun bien immobilier disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyOccupantSelector;
