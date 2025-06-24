
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Image as ImageIcon } from 'lucide-react';

interface PropertyEditPanelProps {
  selectedProperty: any;
  propertySettings: any;
  visibleProperties: any[];
  onCloseEdit: () => void;
  onUpdateDescription: (propertyId: string, description: string) => void;
}

export const PropertyEditPanel = ({
  selectedProperty,
  propertySettings,
  visibleProperties,
  onCloseEdit,
  onUpdateDescription
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
              <p className="text-sm bg-gray-50 p-2 rounded">{selectedProperty.title}</p>
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

            <div className="pt-4 border-t space-y-2">
              <Button 
                onClick={onCloseEdit}
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
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Propriétés visibles: {visibleProperties.length}
              </h4>
              <p className="text-xs text-blue-700">
                Ces propriétés apparaîtront sur votre site web public
              </p>
            </div>

            {visibleProperties.length > 0 && (
              <div className="space-y-2">
                {visibleProperties.slice(0, 3).map((property) => (
                  <div key={property.id} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="font-medium truncate">{property.title}</div>
                    <div className="text-gray-600">{property.rent}€/mois</div>
                  </div>
                ))}
                {visibleProperties.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{visibleProperties.length - 3} autre(s)
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
