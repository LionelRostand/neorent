
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building2, Home, MapPin, Euro } from 'lucide-react';
import type { Property } from '@/types/property';
import type { Tenant } from '@/types/tenant';
import type { Roommate } from '@/types/roommate';

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
  const { t } = useTranslation();

  // Filtrer seulement les biens avec des locataires ou colocataires
  const propertiesWithOccupants = properties.filter(property => {
    const propertyTenants = tenants.filter(tenant => tenant.property === property.id);
    const propertyRoommates = roommates.filter(roommate => roommate.property === property.id);
    return propertyTenants.length > 0 || propertyRoommates.length > 0;
  });

  const getTotalRentalIncome = (property: Property) => {
    const propertyTenants = tenants.filter(tenant => tenant.property === property.id);
    const propertyRoommates = roommates.filter(roommate => roommate.property === property.id);
    
    const tenantRents = propertyTenants.reduce((sum, tenant) => sum + (parseFloat(tenant.rentAmount) || 0), 0);
    const roommateRents = propertyRoommates.reduce((sum, roommate) => sum + (parseFloat(roommate.rentAmount) || 0), 0);
    
    return (tenantRents + roommateRents) * 12; // Annuel
  };

  const getOccupantsInfo = (property: Property) => {
    const propertyTenants = tenants.filter(tenant => tenant.property === property.id);
    const propertyRoommates = roommates.filter(roommate => roommate.property === property.id);
    
    return { tenants: propertyTenants, roommates: propertyRoommates };
  };

  if (propertiesWithOccupants.length === 0) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-center">
          <Building2 className="h-12 w-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            {t('taxes.addRealEstateProperty')}
          </h3>
          <p className="text-orange-600">
            {t('taxes.noPropertySelected')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('taxes.selectPropertiesForDeclaration')}</h3>
      
      <div className="grid gap-4">
        {propertiesWithOccupants.map((property) => {
          const occupants = getOccupantsInfo(property);
          const totalIncome = getTotalRentalIncome(property);
          const isSelected = selectedProperties.includes(property.id);

          return (
            <Card key={property.id} className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        onPropertyChange(property.id, checked as boolean)
                      }
                    />
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{property.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant={isSelected ? "default" : "secondary"}>
                    {totalIncome.toLocaleString('fr-FR')}€/an
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Euro className="h-4 w-4" />
                    <span>Revenus annuels: {totalIncome.toLocaleString('fr-FR')}€</span>
                  </div>

                  <div className="space-y-2">
                    {occupants.tenants.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Locataires:</p>
                        <div className="flex flex-wrap gap-1">
                          {occupants.tenants.map((tenant) => (
                            <Badge key={tenant.id} variant="outline" className="text-xs">
                              {tenant.name} ({(parseFloat(tenant.rentAmount) || 0).toLocaleString('fr-FR')}€/mois)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {occupants.roommates.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Colocataires:</p>
                        <div className="flex flex-wrap gap-1">
                          {occupants.roommates.map((roommate) => (
                            <Badge key={roommate.id} variant="outline" className="text-xs">
                              {roommate.name} - Ch.{roommate.roomNumber} ({(parseFloat(roommate.rentAmount) || 0).toLocaleString('fr-FR')}€/mois)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyOccupantSelector;
