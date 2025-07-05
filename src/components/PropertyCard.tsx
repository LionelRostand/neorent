
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Euro, Edit, Trash2 } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
}

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { roommates } = useFirebaseRoommates();

  const handleCardClick = () => {
    if (onClick) {
      onClick(property);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(property);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm(t('properties.confirmDelete'))) {
      onDelete(property.id);
    }
  };

  const getLocationTypeColor = (locationType: string) => {
    return locationType === 'Colocation' ? 'text-red-600' : 'text-blue-600';
  };

  // Calculer le statut réel basé sur les occupants
  const getRealStatus = () => {
    const activeRoommates = roommates.filter(roommate => 
      roommate.property === property.title && roommate.status === 'Actif'
    );

    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = activeRoommates.length;
      const availableRooms = Math.max(0, totalRooms - occupiedRooms);
      
      if (availableRooms > 0) {
        return t('properties.partiallyOccupied');
      } else if (occupiedRooms > 0) {
        return t('properties.status.occupied');
      } else {
        return t('properties.status.available');
      }
    } else {
      // Location classique
      return activeRoommates.length > 0 ? t('properties.status.occupied') : t('properties.status.available');
    }
  };

  // Calculer les chambres disponibles réelles
  const getRealAvailableRooms = () => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(roommate => 
        roommate.property === property.title && roommate.status === 'Actif'
      );
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = activeRoommates.length;
      return Math.max(0, totalRooms - occupiedRooms);
    }
    return 0;
  };

  const realStatus = getRealStatus();
  const realAvailableRooms = getRealAvailableRooms();

  const getStatusBadgeColor = (status: string) => {
    if (status === t('properties.status.available')) {
      return 'bg-gray-100 text-gray-800';
    } else if (status === t('properties.status.occupied')) {
      return 'bg-green-100 text-green-800';
    } else if (status === t('properties.partiallyOccupied')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Traduire le type de propriété
  const getTranslatedPropertyType = (type: string) => {
    const typeKey = type.toLowerCase();
    return t(`propertyForm.propertyTypes.${typeKey}`, type);
  };

  // Traduire le type de location
  const getTranslatedLocationType = (locationType: string) => {
    const locationKey = locationType.toLowerCase();
    return t(`propertyForm.locationTypes.${locationKey}`, locationType);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <div className="relative">
        <img 
          src={property.image || '/placeholder.svg'} 
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="bg-white/90 hover:bg-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start gap-2">
          <span className="truncate flex-1 min-w-0">{property.title}</span>
          <Badge 
            variant="outline" 
            className={`${getStatusBadgeColor(realStatus)} text-xs px-2 py-1 shrink-0 max-w-[120px] text-center`}
          >
            <span className="truncate">{realStatus}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4 shrink-0" />
            <span className="text-sm truncate">{property.address}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Home className="mr-2 h-4 w-4 shrink-0" />
            <span className="text-sm">{getTranslatedPropertyType(property.type)} - {property.surface}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-600 font-semibold">
              <Euro className="mr-2 h-4 w-4" />
              <span>{property.rent}{t('properties.perMonth')}</span>
            </div>
            <div className={`text-sm font-semibold ${getLocationTypeColor(property.locationType)}`}>
              {getTranslatedLocationType(property.locationType)}
            </div>
          </div>
          {property.locationType === 'Colocation' && (
            <div className="text-sm text-gray-500">
              {realAvailableRooms}/{property.totalRooms} {t('properties.roomsAvailable')}
            </div>
          )}
          {property.tenant && (
            <div className="text-sm text-green-600">
              {t('tenants.tenant')}: {property.tenant}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
