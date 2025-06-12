
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, User } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  rent: string;
  charges?: Record<string, any>;
  locationType?: string;
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
  rent: string;
}

interface PropertySelectorProps {
  properties: Property[];
  tenants: Tenant[];
  roommates: Roommate[];
  selectedProperties: string[];
  selectedTenants: string[];
  selectedRoommates: string[];
  onPropertyChange: (propertyId: string, checked: boolean) => void;
  onTenantChange: (tenantId: string, checked: boolean) => void;
  onRoommateChange: (roommateId: string, checked: boolean) => void;
}

const PropertySelector = ({ 
  properties, 
  tenants, 
  roommates, 
  selectedProperties, 
  selectedTenants, 
  selectedRoommates, 
  onPropertyChange, 
  onTenantChange, 
  onRoommateChange 
}: PropertySelectorProps) => {
  return (
    <div className="space-y-4">
      <Label>Sélectionner les sources de revenus locatifs</Label>
      
      {/* Biens immobiliers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Biens Immobiliers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {properties.map((property) => (
            <div key={property.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                id={`property-${property.id}`}
                checked={selectedProperties.includes(property.id)}
                onCheckedChange={(checked) => onPropertyChange(property.id, checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor={`property-${property.id}`} className="text-sm font-medium cursor-pointer">
                  {property.title}
                </label>
                <p className="text-xs text-gray-500">
                  Loyer: {property.rent}€/mois • Type: {property.locationType || 'Location'}
                </p>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun bien immobilier disponible
            </p>
          )}
        </CardContent>
      </Card>

      {/* Locataires */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Locataires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                id={`tenant-${tenant.id}`}
                checked={selectedTenants.includes(tenant.id)}
                onCheckedChange={(checked) => onTenantChange(tenant.id, checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor={`tenant-${tenant.id}`} className="text-sm font-medium cursor-pointer">
                  {tenant.name}
                </label>
                <p className="text-xs text-gray-500">
                  Loyer: {tenant.rentAmount}€/mois • Bien: {tenant.property}
                </p>
              </div>
            </div>
          ))}
          {tenants.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun locataire disponible
            </p>
          )}
        </CardContent>
      </Card>

      {/* Colocataires */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Colocataires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roommates.map((roommate) => (
            <div key={roommate.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                id={`roommate-${roommate.id}`}
                checked={selectedRoommates.includes(roommate.id)}
                onCheckedChange={(checked) => onRoommateChange(roommate.id, checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor={`roommate-${roommate.id}`} className="text-sm font-medium cursor-pointer">
                  {roommate.name}
                </label>
                <p className="text-xs text-gray-500">
                  Loyer: {roommate.rent}€/mois • Bien: {roommate.property}
                </p>
              </div>
            </div>
          ))}
          {roommates.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun colocataire disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySelector;
