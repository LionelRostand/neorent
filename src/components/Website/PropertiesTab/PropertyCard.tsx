
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { toast } from 'sonner';
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
  const { roommates } = useFirebaseRoommates();
  const { updateProperty } = useFirebaseProperties();
  
  // Utiliser id pour Firebase au lieu de _id
  const propertyId = property.id;
  const settings = propertySettings[propertyId] || { visible: false, featured: false };

  // Utiliser le statut de la propriété (permettre modification manuelle)
  const currentStatus = property.status;

  console.log('🔍 PropertyCard Debug:', {
    propertyTitle: property.title,
    currentStatus,
    propertyId,
    settings,
    hasUpdateProperty: typeof updateProperty === 'function'
  });

  const handleStatusChange = async (newStatus: string) => {
    console.log('🔄 Status change:', { from: currentStatus, to: newStatus, propertyId });
    try {
      await updateProperty(propertyId, { status: newStatus });
      toast.success('Statut mis à jour');
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const statusOptions = [
    'Libre',
    'Occupé',
    'Partiellement occupé',
    'En maintenance'
  ];

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
              <Select value={currentStatus || 'Libre'} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-24 h-6 text-xs bg-blue-500 text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border z-[200]">
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status} className="text-xs">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 ml-3">
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
              onCheckedChange={() => onToggleVisibility(propertyId)}
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
              onCheckedChange={() => onToggleFeatured(propertyId)}
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
