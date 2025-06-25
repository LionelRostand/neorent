
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Star, 
  Edit,
  MapPin,
  Euro,
  Square
} from 'lucide-react';

interface PropertyCardProps {
  property: any;
  propertySettings: any;
  onToggleVisibility: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onEdit: (property: any) => void;
  getStatusBadgeVariant: (status: string) => "default" | "destructive" | "outline" | "secondary" | "success";
}

export const PropertyCard = ({
  property,
  propertySettings,
  onToggleVisibility,
  onToggleFeatured,
  onEdit,
  getStatusBadgeVariant
}: PropertyCardProps) => {
  const settings = propertySettings[property.id] || { visible: false, featured: false };

  return (
    <Card className={`transition-all ${settings.visible ? 'ring-2 ring-green-200 bg-green-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <div className="flex items-center">
                <Euro className="h-3 w-3 mr-1" />
                {property.rent}€
              </div>
              <div className="flex items-center">
                <Square className="h-3 w-3 mr-1" />
                {property.surface}m²
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 ml-3">
            <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
              {property.status}
            </Badge>
            {settings.featured && (
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                Mise en avant
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.visible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm font-medium">
                Visible sur le site
              </span>
            </div>
            <Switch
              checked={settings.visible}
              onCheckedChange={() => onToggleVisibility(property.id)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                Mettre en avant
              </span>
            </div>
            <Switch
              checked={settings.featured}
              onCheckedChange={() => onToggleFeatured(property.id)}
              disabled={!settings.visible}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(property)}
            className="w-full mt-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
