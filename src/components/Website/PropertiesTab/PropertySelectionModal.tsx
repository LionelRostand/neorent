
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Euro, Check, Image as ImageIcon } from 'lucide-react';

interface PropertySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: any[];
  onSelectProperty: (property: any) => void;
  selectedProperties: string[];
}

export const PropertySelectionModal = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
  selectedProperties
}: PropertySelectionModalProps) => {
  
  useEffect(() => {
    console.log('🔥🔥🔥 PropertySelectionModal MOUNT/UPDATE:', { 
      isOpen, 
      propertiesCount: properties?.length || 0, 
      properties: properties,
      selectedProperties 
    });
  }, [isOpen, properties, selectedProperties]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'secondary' as const;
      case 'Occupé':
        return 'default' as const;
      case 'En maintenance':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  // Filtrer les propriétés non sélectionnées
  const availableProperties = properties?.filter(prop => 
    !selectedProperties.includes(prop.id)
  ) || [];

  console.log('🔥🔥🔥 Available properties after filtering:', availableProperties);

  if (!isOpen) {
    console.log('🔥🔥🔥 Modal fermé, pas de rendu');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sélectionner des propriétés à ajouter au site web
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Info sur la sélection */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Information :</strong> Les propriétés sélectionnées apparaîtront sur votre site web public avec toutes leurs informations (photos, description, prix, etc.)
            </p>
          </div>

          {availableProperties && availableProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProperties.map((property) => {
                const isSelected = selectedProperties.includes(property.id);
                
                return (
                  <Card 
                    key={property.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`}
                    onClick={() => {
                      console.log('🔥 Property clicked:', property);
                      onSelectProperty(property);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          {/* Image de la propriété */}
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
                            {property.image && property.image !== '/placeholder.svg' ? (
                              <img 
                                src={property.image} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {property.title || 'Titre non défini'}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3" />
                              {property.address || 'Adresse non définie'}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              <Euro className="h-3 w-3" />
                              {property.rent || '0'}€/mois
                            </span>
                            <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                              {property.status || 'Non défini'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500 block">
                              {property.surface || '0'}m² • {property.type || 'Type non défini'}
                            </span>
                            {property.locationType && (
                              <span className="text-xs text-blue-600">
                                {property.locationType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {properties?.length === 0 ? 
                  'Aucune propriété disponible dans la base de données' : 
                  'Toutes les propriétés sont déjà ajoutées'
                }
              </h3>
              <p className="text-gray-500 text-sm">
                {properties?.length === 0 ? 
                  'Ajoutez des propriétés depuis la section Propriétés pour les sélectionner' :
                  'Toutes vos propriétés sont déjà visibles sur le site web'
                }
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-3 pt-4 border-t">
          <p className="text-sm text-gray-600">
            {selectedProperties.length} propriété(s) sélectionnée(s) pour le site web
          </p>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
