import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Upload, Image as ImageIcon, Building } from 'lucide-react';

interface PropertyEditPanelProps {
  selectedProperty: any;
  propertySettings: any;
  visibleProperties: any[];
  onUpdateDescription: (propertyId: string, description: string) => void;
  onClose: () => void;
}

export const PropertyEditPanel = ({
  selectedProperty,
  propertySettings,
  visibleProperties,
  onUpdateDescription,
  onClose
}: PropertyEditPanelProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {selectedProperty ? 'Modifier la Propriété' : 'Aperçu Site Web'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedProperty ? (
          <>
            <div>
              <Label className="text-sm font-medium">Titre</Label>
              <Input value={selectedProperty.title} readOnly className="bg-gray-50" />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description pour le site web</Label>
              <Textarea
                placeholder="Ajoutez une description attractive pour votre site web..."
                rows={4}
                value={propertySettings[selectedProperty.id]?.description || ''}
                onChange={(e) => onUpdateDescription(selectedProperty.id, e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Photo actuelle</Label>
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {selectedProperty.image && selectedProperty.image !== '/placeholder.svg' ? (
                  <img 
                    src={selectedProperty.image} 
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune photo</p>
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Changer la photo
            </Button>

            <div className="pt-4 border-t space-y-2">
              <Button 
                onClick={onClose}
                variant="outline" 
                className="w-full"
              >
                Fermer
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Aperçu du site web
                  </h4>
                  <p className="text-xs text-blue-700">
                    Les propriétés marquées comme visibles apparaîtront sur votre site web public
                  </p>
                </div>
              </div>
            </div>

            {visibleProperties.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Propriétés visibles ({visibleProperties.length})</h4>
                {visibleProperties.slice(0, 3).map((property) => (
                  <div key={property.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                        {property.image && property.image !== '/placeholder.svg' ? (
                          <img 
                            src={property.image} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium truncate">{property.title}</h5>
                        <p className="text-xs text-gray-600">{property.rent}€/mois</p>
                      </div>
                    </div>
                  </div>
                ))}
                {visibleProperties.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{visibleProperties.length - 3} autre(s) propriété(s)
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Aucune propriété visible sur le site web
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
