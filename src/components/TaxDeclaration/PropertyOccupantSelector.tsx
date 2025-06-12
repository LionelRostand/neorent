
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
  leaseStart?: string;
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

  // Créer une liste de tous les éléments sélectionnables (propriétés + locataires/colocataires)
  const createSelectableItems = () => {
    const items: any[] = [];
    
    // Ajouter les propriétés
    properties.forEach(property => {
      items.push({
        type: 'property',
        id: property.id,
        title: property.title,
        rent: property.rent,
        icon: '🏢'
      });
    });

    // Ajouter les locataires comme éléments séparés
    tenants.forEach(tenant => {
      items.push({
        type: 'tenant',
        id: `tenant-${tenant.id}`,
        title: tenant.property,
        subtitle: `Locataire: ${tenant.name}`,
        rent: tenant.rentAmount,
        icon: '👤',
        leaseStart: tenant.leaseStart
      });
    });

    // Ajouter les colocataires comme éléments séparés
    roommates.forEach(roommate => {
      items.push({
        type: 'roommate',
        id: `roommate-${roommate.id}`,
        title: roommate.property,
        subtitle: `Locataire: ${roommate.name}`,
        rent: roommate.rentAmount,
        icon: '👥'
      });
    });

    return items;
  };

  const selectableItems = createSelectableItems();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <Label>Sélection des biens immobiliers</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectableItems.map((item, index) => (
          <Card key={item.id} className="border-2 hover:border-blue-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  checked={selectedProperties.includes(item.id)}
                  onCheckedChange={(checked) => onPropertyChange(item.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <label htmlFor={item.id} className="font-semibold text-gray-900 cursor-pointer">
                      {item.title}
                    </label>
                  </div>
                  
                  {item.subtitle && (
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-600">{item.rent}€/mois</p>
                    {item.leaseStart && (
                      <p className="text-xs text-gray-500">
                        Depuis: {formatDate(item.leaseStart)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectableItems.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">
            Aucun bien immobilier ou locataire disponible
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyOccupantSelector;
