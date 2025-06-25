
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertySelectionModal } from './PropertySelectionModal';
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
    console.log('🔥 Avant setShowPropertySelectionModal(true)');
    console.log('🔥 État actuel du modal:', showPropertySelectionModal);
    console.log('🔥 Type de setShowPropertySelectionModal:', typeof setShowPropertySelectionModal);
    
    setShowPropertySelectionModal(true);
    
    console.log('🔥 Après setShowPropertySelectionModal(true)');
    
    // Vérification après un court délai pour voir si l'état a changé
    setTimeout(() => {
      console.log('🔥 État du modal après 100ms:', showPropertySelectionModal);
    }, 100);
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

  // Combiner toutes les propriétés disponibles (owner + admin)
  const allAvailableProperties = [
    ...(ownerProperties || []),
    ...(allAdminProperties || [])
  ];

  // Supprimer les doublons basés sur l'ID
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  // Obtenir les IDs des propriétés déjà sélectionnées (visibles)
  const selectedPropertyIds = Object.keys(propertySettings || {})
    .filter(propertyId => propertySettings[propertyId]?.visible)
    .filter(propertyId => uniqueProperties.some(p => p.id === propertyId));

  // Propriétés disponibles pour le modal (non encore sélectionnées)
  const availablePropertiesForModal = uniqueProperties.filter(property => 
    !selectedPropertyIds.includes(property.id)
  );

  console.log('🚀 Unique properties:', uniqueProperties);
  console.log('🚀 Selected property IDs:', selectedPropertyIds);
  console.log('🚀 Available for modal:', availablePropertiesForModal);
  console.log('🚀 Modal state:', showPropertySelectionModal);
  console.log('🚀 Loading properties:', loadingProperties);

  return (
    <>
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
                onClick={handleAddProperty}
                disabled={loadingProperties || availablePropertiesForModal.length === 0}
                className="w-full"
              >
                <Building className="h-4 w-4 mr-2" />
                {loadingProperties 
                  ? 'Chargement...' 
                  : availablePropertiesForModal.length === 0 
                    ? 'Toutes les propriétés sont déjà affichées'
                    : `Ajouter une propriété (${availablePropertiesForModal.length} disponible${availablePropertiesForModal.length > 1 ? 's' : ''})`
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {console.log('🔥 Rendering PropertySelectionModal with isOpen:', showPropertySelectionModal)}
      <PropertySelectionModal
        isOpen={showPropertySelectionModal}
        onClose={handleCloseModal}
        properties={availablePropertiesForModal}
        onSelectProperty={handleSelectProperty}
        selectedProperties={selectedPropertyIds}
      />
    </>
  );
};
