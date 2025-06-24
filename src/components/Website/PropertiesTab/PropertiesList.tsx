
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertySelectionModal } from './PropertySelectionModal';
import { PropertyQuickSelector } from './PropertyQuickSelector';
import { PropertyListActions } from './PropertyListActions';
import { EmptyPropertyState } from './EmptyPropertyState';
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
  const [selectedPropertyToAdd, setSelectedPropertyToAdd] = useState<string>('');

  console.log('🚀 PropertiesList render');
  console.log('🚀 Modal state:', showPropertySelectionModal);
  console.log('🚀 All admin properties:', allAdminProperties);
  console.log('🚀 Owner properties:', ownerProperties);
  console.log('🚀 Loading properties:', loadingProperties);

  const handleAddProperty = () => {
    console.log('🔥 BOUTON CLIQUÉ - handleAddProperty appelé');
    console.log('🔥 État actuel du modal:', showPropertySelectionModal);
    console.log('🔥 Propriétés disponibles:', allAdminProperties);
    
    setShowPropertySelectionModal(true);
    
    console.log('🔥 setShowPropertySelectionModal(true) appelé');
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
      setSelectedPropertyToAdd('');
    }
  };

  const selectedPropertyIds = properties
    ?.filter(p => propertySettings[p.id]?.visible)
    .map(p => p.id) || [];

  console.log('Selected property IDs:', selectedPropertyIds);

  // Combiner toutes les propriétés (owner + admin) disponibles
  const allAvailableProperties = [
    ...(ownerProperties || []),
    ...(allAdminProperties || [])
  ];

  // Supprimer les doublons basés sur l'ID
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  // S'assurer que nous avons les données nécessaires pour le modal
  const modalProperties = allAdminProperties || [];
  
  // Filtrer les propriétés non sélectionnées pour le champ de sélection
  const availablePropertiesForSelect = uniqueProperties.filter(prop => 
    !selectedPropertyIds.includes(prop.id)
  );

  console.log('🚀 All available properties:', uniqueProperties);
  console.log('🚀 Available for select:', availablePropertiesForSelect);
  console.log('🚀 Modal properties pour le rendu:', modalProperties);
  console.log('🚀 showPropertySelectionModal avant rendu:', showPropertySelectionModal);

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
            selectedPropertyToAdd={selectedPropertyToAdd}
            setSelectedPropertyToAdd={setSelectedPropertyToAdd}
            availablePropertiesForSelect={availablePropertiesForSelect}
            loadingProperties={loadingProperties}
            uniqueProperties={uniqueProperties}
            ownerProperties={ownerProperties || []}
            allAdminProperties={allAdminProperties || []}
            onDirectPropertyAdd={handleDirectPropertyAdd}
          />

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
              
              <PropertyListActions
                loadingProperties={loadingProperties}
                onAddProperty={handleAddProperty}
                onPreviewSite={handlePreviewSite}
              />
            </div>
          ) : (
            <EmptyPropertyState
              loadingProperties={loadingProperties}
              onAddProperty={handleAddProperty}
            />
          )}
        </CardContent>
      </Card>

      {console.log('🚀 RENDU DU MODAL - État:', showPropertySelectionModal)}
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
