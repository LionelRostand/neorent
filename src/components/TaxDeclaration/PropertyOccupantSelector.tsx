
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Building2, Users, X, Trash2 } from 'lucide-react';

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

  // Fonction pour ajouter un bien
  const handleAddProperty = (propertyId: string) => {
    if (propertyId && !selectedProperties.includes(propertyId)) {
      onPropertyChange(propertyId, true);
    }
  };

  // Fonction pour supprimer un bien
  const handleRemoveProperty = (propertyId: string) => {
    onPropertyChange(propertyId, false);
  };

  // Fonction pour supprimer toutes les sélections
  const handleClearAll = () => {
    selectedProperties.forEach(propertyId => {
      onPropertyChange(propertyId, false);
    });
  };

  // Obtenir les biens disponibles (non sélectionnés)
  const availableProperties = properties.filter(property => 
    !selectedProperties.includes(property.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Sélectionner les biens pour la déclaration</Label>
        {selectedProperties.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Tout supprimer
          </Button>
        )}
      </div>
      
      {/* Menu déroulant pour ajouter des biens */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Ajouter un bien immobilier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleAddProperty}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un bien à ajouter..." />
            </SelectTrigger>
            <SelectContent>
              {availableProperties.length > 0 ? (
                availableProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{property.title} - {property.rent}€/mois</span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-properties" disabled>
                  {properties.length === 0 ? "Aucun bien disponible" : "Tous les biens sont déjà sélectionnés"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {properties.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Aucun bien immobilier trouvé en base de données. Veuillez d'abord ajouter des biens dans la section Propriétés.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Liste des biens sélectionnés */}
      {selectedProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Biens sélectionnés ({selectedProperties.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProperties.map((propertyId) => {
              const property = properties.find(p => p.id === propertyId);
              if (!property) return null;
              
              const occupants = getPropertyOccupants(property.title);
              const annualIncome = getPropertyAnnualIncome(property);
              
              return (
                <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-blue-800">
                        {property.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Type: {property.locationType || 'Location'} • Loyer base: {property.rent}€/mois
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        Revenu annuel total: {annualIncome.toLocaleString('fr-FR')}€
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveProperty(property.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
              );
            })}
          </CardContent>
        </Card>
      )}

      {selectedProperties.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun bien sélectionné</h3>
          <p className="mt-2 text-gray-500">
            Utilisez le menu déroulant ci-dessus pour ajouter des biens à votre déclaration fiscale.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyOccupantSelector;
