
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { EmptyPropertyState } from './EmptyPropertyState';

interface PropertiesListProps {
  properties: any[];
  propertySettings: any;
  onToggleVisibility: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onEditProperty: (property: any) => void;
  getStatusBadgeVariant: (status: string) => "default" | "destructive" | "outline" | "secondary" | "success";
}

export const PropertiesList = ({
  properties,
  propertySettings,
  onToggleVisibility,
  onToggleFeatured,
  onEditProperty,
  getStatusBadgeVariant
}: PropertiesListProps) => {

  const handlePreviewSite = () => {
    window.open('/properties', '_blank');
  };

  // Compter les propriétés visibles pour l'affichage dans le titre
  const visiblePropertiesCount = properties?.filter(p => propertySettings[p.id]?.visible)?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Gestion des Propriétés du Site Web ({visiblePropertiesCount} affichées sur {properties?.length || 0})
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
            <EmptyPropertyState />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
