
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink } from 'lucide-react';
import { PropertyCard } from './PropertyCard';

interface PropertiesListProps {
  properties: any[];
  propertySettings: any;
  onToggleVisibility: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onEditProperty: (property: any) => void;
  getStatusBadgeVariant: (status: string) => "default" | "destructive" | "outline" | "secondary" | "success";
  onAddProperty: () => void;
  availablePropertiesCount: number;
  loadingProperties: boolean;
}

export const PropertiesList = ({
  properties,
  propertySettings,
  onToggleVisibility,
  onToggleFeatured,
  onEditProperty,
  getStatusBadgeVariant,
  onAddProperty,
  availablePropertiesCount,
  loadingProperties
}: PropertiesListProps) => {

  const handlePreviewSite = () => {
    window.open('/properties', '_blank');
  };

  console.log('🚀 PropertiesList render');
  console.log('🚀 Visible properties (passed as props):', properties);
  console.log('🚀 Available properties count:', availablePropertiesCount);
  console.log('🚀 Loading properties:', loadingProperties);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Gestion des Propriétés du Site Web ({properties?.length || 0} affichées)
          </div>
          <Button variant="outline" size="sm" onClick={handlePreviewSite}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Aperçu site
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                propertySettings={propertySettings}
                onToggleVisibility={onToggleVisibility}
                onToggleFeatured={onToggleFeatured}
                onEdit={onEditProperty}
                getStatusBadgeVariant={getStatusBadgeVariant}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Aucune propriété affichée sur le site
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Cliquez sur "Ajouter une propriété" pour sélectionner les propriétés à afficher sur votre site web
              </p>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={onAddProperty}
              disabled={loadingProperties || availablePropertiesCount === 0}
              className="w-full"
            >
              <Building className="h-4 w-4 mr-2" />
              {loadingProperties 
                ? 'Chargement...' 
                : availablePropertiesCount === 0 
                  ? 'Toutes les propriétés sont déjà affichées'
                  : `Ajouter une propriété (${availablePropertiesCount} disponible${availablePropertiesCount > 1 ? 's' : ''})`
              }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
