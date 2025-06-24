
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertySelectionModal } from './PropertySelectionModal';
import { PropertyQuickSelector } from './PropertyQuickSelector';
import { PropertyListActions } from './PropertyListActions';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

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
  const { properties: ownerProperties } = useOwnerData(userProfile);
  const { properties: allAdminProperties, loading: loadingProperties } = useFirebaseProperties();
  const [showPropertySelectionModal, setShowPropertySelectionModal] = useState(false);

  console.log('🚀 PropertiesList render');
  console.log('🚀 All admin properties:', allAdminProperties);
  console.log('🚀 Owner properties:', ownerProperties);
  console.log('🚀 Visible properties (passed as props):', properties);

  const handleAddProperty = () => {
    console.log('🔥 BOUTON CLIQUÉ - handleAddProperty appelé');
    setShowPropertySelectionModal(true);
  };

  const handleSelectProperty = (property: any) => {
    console.log('🔥 Selected property for website:', property);
    onToggleVisibility(property.id);
    setShowPropertySelectionModal(false);
  };

  const handleCloseModal = () => {
    console.log('🔥 Closing modal');
    setShowPropertySelectionModal(false);
  };

  const handlePreviewSite = () => {
    window.open('/properties', '_blank');
  };

  const handleDirectPropertyAdd = (propertyId: string) => {
    if (propertyId) {
      console.log('🔥 Adding property directly:', propertyId);
      onToggleVisibility(propertyId);
    }
  };

  // Combiner toutes les propriétés disponibles (owner + admin)
  const allAvailableProperties = [
    ...(ownerProperties || []),
    ...(allAdminProperties || [])
  ];

  // Supprimer les doublons basés sur l'ID
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  // Obtenir les IDs des propriétés déjà sélectionnées
  const selectedPropertyIds = uniqueProperties
    ?.filter(p => propertySettings[p.id]?.visible)
    .map(p => p.id) || [];

  // Filtrer les propriétés non sélectionnées pour le champ de sélection
  const availablePropertiesForSelect = uniqueProperties.filter(prop => 
    !selectedPropertyIds.includes(prop.id)
  );

  // Propriétés pour le modal (toutes les propriétés disponibles)
  const modalProperties = uniqueProperties || [];

  console.log('🚀 Unique properties:', uniqueProperties);
  console.log('🚀 Available for select:', availablePropertiesForSelect);
  console.log('🚀 Selected property IDs:', selectedPropertyIds);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Gestion des Propriétés du Site Web ({properties?.length || 0} affichées)
            </div>
            <PropertyListActions
              loadingProperties={loadingProperties}
              onAddProperty={handleAddProperty}
              onPreviewSite={handlePreviewSite}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyQuickSelector
            selectedPropertyToAdd=""
            setSelectedPropertyToAdd={() => {}}
            availablePropertiesForSelect={availablePropertiesForSelect}
            loadingProperties={loadingProperties}
            uniqueProperties={uniqueProperties}
            ownerProperties={ownerProperties || []}
            allAdminProperties={allAdminProperties || []}
            onDirectPropertyAdd={handleDirectPropertyAdd}
          />

          <div className="space-y-4">
            {properties && properties.map((property) => (
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
            
            <PropertyListActions
              loadingProperties={loadingProperties}
              onAddProperty={handleAddProperty}
              onPreviewSite={handlePreviewSite}
            />
          </div>
        </CardContent>
      </Card>

      <PropertySelectionModal
        isOpen={showPropertySelectionModal}
        onClose={handleCloseModal}
        properties={modalProperties}
        onSelectProperty={handleSelectProperty}
        selectedProperties={selectedPropertyIds}
      />
    </>
  );
};
