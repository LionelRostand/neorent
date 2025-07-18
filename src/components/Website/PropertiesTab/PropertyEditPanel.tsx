
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X, 
  Edit, 
  MapPin, 
  Euro, 
  Square,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';

interface PropertyEditPanelProps {
  selectedProperty: any;
  propertySettings: any;
  visibleProperties: any[];
  onCloseEdit: () => void;
  onUpdateDescription: (id: string, description: string) => void;
}

export const PropertyEditPanel = ({
  selectedProperty,
  propertySettings,
  visibleProperties,
  onCloseEdit,
  onUpdateDescription
}: PropertyEditPanelProps) => {
  const [localImages, setLocalImages] = React.useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = React.useState('');

  React.useEffect(() => {
    if (selectedProperty) {
      // Initialize images from both legacy 'image' field and new 'images' array
      const existingImages = [];
      if (selectedProperty.image && selectedProperty.image !== '/placeholder.svg') {
        existingImages.push(selectedProperty.image);
      }
      if (selectedProperty.images && Array.isArray(selectedProperty.images)) {
        existingImages.push(...selectedProperty.images);
      }
      // Remove duplicates and limit to 3
      const uniqueImages = [...new Set(existingImages)].slice(0, 3);
      setLocalImages(uniqueImages);
    }
  }, [selectedProperty]);

  const addImage = () => {
    if (newImageUrl.trim() && localImages.length < 3) {
      const updatedImages = [...localImages, newImageUrl.trim()];
      setLocalImages(updatedImages);
      setNewImageUrl('');
      // You would typically save this to your backend here
      console.log('Updated images for property:', selectedProperty?.id, updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages);
    // You would typically save this to your backend here
    console.log('Updated images for property:', selectedProperty?.id, updatedImages);
  };

  if (!selectedProperty) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Edit className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 font-medium">Aucune propriété sélectionnée</p>
          <p className="text-sm text-gray-500 mt-1">
            Cliquez sur "Modifier" sur une propriété pour l'éditer
          </p>
        </CardContent>
      </Card>
    );
  }

  const settings = propertySettings[selectedProperty.id] || { visible: false, description: '', featured: false };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Modifier la propriété</span>
          <Button variant="ghost" size="sm" onClick={onCloseEdit}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">{selectedProperty.title}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{selectedProperty.address}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center">
              <Euro className="h-3 w-3 mr-1" />
              {selectedProperty.rent}€
            </div>
            <div className="flex items-center">
              <Square className="h-3 w-3 mr-1" />
              {selectedProperty.surface}m²
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={settings.visible ? "default" : "outline"}>
              {settings.visible ? "Visible" : "Masqué"}
            </Badge>
            {settings.featured && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Mise en avant
              </Badge>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Images de la propriété (max 3)</Label>
          
          {/* Display current images */}
          <div className="grid grid-cols-1 gap-3">
            {localImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add new image */}
          {localImages.length < 3 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="URL de l'image"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={addImage}
                  disabled={!newImageUrl.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {localImages.length}/3 images ajoutées
                {localImages.length >= 3 && " (maximum atteint)"}
              </p>
            </div>
          )}

          {localImages.length === 0 && (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Aucune image</p>
              </div>
            </div>
          )}
        </div>

        {/* Description for website */}
        <div className="space-y-2">
          <Label htmlFor="description">Description pour le site web</Label>
          <Textarea
            id="description"
            placeholder="Ajoutez une description personnalisée pour cette propriété sur votre site web..."
            value={settings.description}
            onChange={(e) => onUpdateDescription(selectedProperty.id, e.target.value)}
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Cette description sera affichée sur votre site web public
          </p>
        </div>

        {/* Visibility info */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Statut:</strong> {settings.visible ? 
              "Cette propriété est visible sur votre site web" : 
              "Cette propriété est masquée du site web"
            }
          </p>
          {settings.featured && (
            <p className="text-sm text-blue-700 mt-1">
              Cette propriété est mise en avant sur le site
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
