
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';

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
  const { userProfile } = useAuth();
  const { setOpenDialog } = useOwnerQuickActions(userProfile);

  const handleAddProperty = () => {
    setOpenDialog('property');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Gestion des Propriétés ({properties?.length || 0})
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Aperçu site
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {properties && properties.length > 0 ? (
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                propertySettings={propertySettings}
                onToggleVisibility={onToggleVisibility}
                onToggleFeatured={onToggleFeatured}
                onEdit={onEditProperty}
                getStatusBadgeVariant={getStatusBadgeVariant}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Ajoutez des propriétés depuis la section Propriétés pour les afficher sur votre site web
            </p>
            <Button variant="outline" onClick={handleAddProperty}>
              <Building className="h-4 w-4 mr-2" />
              Ajouter une propriété
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
