
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Euro, Image as ImageIcon } from 'lucide-react';

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
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | "success" => {
    switch (status) {
      case 'Libre':
        return 'secondary';
      case 'Occupé':
        return 'default';
      case 'En maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const availableProperties = properties.filter(property => 
    !selectedProperties.includes(property.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sélectionner des propriétés pour votre site web
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {availableProperties.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Toutes les propriétés sont déjà affichées
              </h3>
              <p className="text-gray-500 text-sm">
                Toutes les propriétés disponibles sont déjà sélectionnées pour votre site web.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Cliquez sur une propriété pour l'ajouter à votre site web ({availableProperties.length} disponible(s))
              </p>

              <div className="grid gap-4">
                {availableProperties.map((property) => (
                  <Card 
                    key={property.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                    onClick={() => onSelectProperty(property)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Image de la propriété */}
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {property.image && property.image !== '/placeholder.svg' ? (
                            <img 
                              src={property.image} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        {/* Informations de la propriété */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 font-medium">
                              <Euro className="h-3 w-3" />
                              {property.rent}€/mois
                            </span>
                            <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                              {property.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {property.owner ? 'Propriétaire' : 'Admin'}
                            </Badge>
                          </div>
                        </div>

                        {/* Bouton d'action */}
                        <Button variant="outline" size="sm">
                          Ajouter au site
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
