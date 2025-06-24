
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Euro, Edit, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

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
  const isVisible = propertySettings[property.id]?.visible || false;
  const isFeatured = propertySettings[property.id]?.featured || false;

  return (
    <div 
      className={`border rounded-lg p-4 transition-all ${
        isVisible 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Image de la propriété */}
        <div className="w-full lg:w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
        <div className="flex-1 space-y-3">
          <div>
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
              {isFeatured && (
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                  Mise en avant
                </Badge>
              )}
            </div>
          </div>

          {/* Contrôles de visibilité */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium whitespace-nowrap">
                Visible sur le site
              </Label>
              <Switch
                checked={isVisible}
                onCheckedChange={() => onToggleVisibility(property.id)}
              />
              {isVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium whitespace-nowrap">
                Mettre en avant
              </Label>
              <Switch
                checked={isFeatured}
                onCheckedChange={() => onToggleFeatured(property.id)}
                disabled={!isVisible}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(property)}
              className="ml-auto"
            >
              <Edit className="h-3 w-3 mr-1" />
              Modifier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
