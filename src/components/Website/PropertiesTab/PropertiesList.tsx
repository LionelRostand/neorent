
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

  console.log('🚀 PropertiesList render - Modal state:', showPropertySelectionModal);
  console.log('🚀 All admin properties:', allAdminProperties);
  console.log('🚀 Loading properties:', loadingProperties);

  const handleAddProperty = () => {
    console.log('🔥🔥🔥 BOUTON CLIQUÉ - handleAddProperty appelé');
    console.log('🔥🔥🔥 État actuel du modal:', showPropertySelectionModal);
    console.log('🔥🔥🔥 Propriétés disponibles:', allAdminProperties);
    
    setShowPropertySelectionModal(true);
    
    console.log('🔥🔥🔥 Modal state APRÈS setShowPropertySelectionModal(true)');
    
    // Force un re-render pour s'assurer que le modal s'ouvre
    setTimeout(() => {
      console.log('🔥🔥🔥 Modal state dans setTimeout:', showPropertySelectionModal);
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
    // Ouvrir la page des propriétés du site public dans un nouvel onglet
    window.open('/properties', '_blank');
  };

  const selectedPropertyIds = properties
    ?.filter(p => propertySettings[p.id]?.visible)
    .map(p => p.id) || [];

  console.log('Selected property IDs:', selectedPropertyIds);

  // S'assurer que nous avons les données nécessaires
  const modalProperties = allAdminProperties || [];
  
  console.log('🚀 Modal properties pour le rendu:', modalProperties);
  console.log('🚀 showPropertySelectionModal:', showPropertySelectionModal);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Gestion des Propriétés ({properties?.length || 0})
            </div>
            <Button variant="outline" size="sm" onClick={handlePreviewSite}>
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
              
              {/* Bouton pour ajouter plus de propriétés */}
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={handleAddProperty}
                  disabled={loadingProperties}
                  className="w-full"
                >
                  <Building className="h-4 w-4 mr-2" />
                  {loadingProperties ? 'Chargement...' : 'Ajouter d\'autres propriétés'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Aucune propriété affichée sur le site
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Sélectionnez des propriétés depuis votre base de données pour les afficher sur votre site web public
              </p>
              <Button 
                variant="outline" 
                onClick={handleAddProperty}
                disabled={loadingProperties}
              >
                <Building className="h-4 w-4 mr-2" />
                {loadingProperties ? 'Chargement...' : 'Sélectionner des propriétés'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de sélection des propriétés */}
      {console.log('🚀🚀🚀 RENDU DU MODAL - État:', showPropertySelectionModal)}
      {showPropertySelectionModal && (
        <PropertySelectionModal
          isOpen={showPropertySelectionModal}
          onClose={handleCloseModal}
          properties={modalProperties}
          onSelectProperty={handleSelectProperty}
          selectedProperties={selectedPropertyIds}
        />
      )}
    </>
  );
};
