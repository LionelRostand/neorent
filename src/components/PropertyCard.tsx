
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Euro, Edit, Trash2, Camera } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

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
  const { updateProperty } = useFirebaseProperties();

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

  const handlePhotoUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          try {
            // Mise à jour de la propriété avec la nouvelle image
            await updateProperty(property.id, { ...property, image: base64Image });
            console.log('Property updated with new image');
            // L'image sera automatiquement affichée grâce au re-render du composant
          } catch (error) {
            console.error('Error updating property image:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getLocationTypeColor = (locationType: string) => {
    return locationType === 'Colocation' ? 'text-red-600' : 'text-blue-600';
  };

  // Calculer le statut réel basé sur les occupants
  const getRealStatus = () => {
    if (property.locationType === 'Colocation') {
      console.log(`🔍 Debug pour ${property.title}:`, {
        propertyId: property.id,
        totalRoommates: roommates.length,
        roommatesForThisProperty: roommates.filter(r => r.property === property.title || r.property === property.id),
        allRoommates: roommates
      });
      
      const activeRoommates = roommates.filter(roommate => 
        (roommate.property === property.title || roommate.property === property.id) && roommate.status === 'Actif'
      ).length;

      const totalRooms = property.totalRooms || 1;
      const availableRooms = totalRooms - activeRoommates;
      
      console.log(`🏠 ${property.title}: ${activeRoommates} colocataires actifs / ${totalRooms} chambres = ${availableRooms} disponibles`);
      
      // Logique corrigée : si toutes les chambres sont libres = Libre
      if (availableRooms === totalRooms) {
        console.log(`✅ Statut admin: Libre (${availableRooms}/${totalRooms})`);
        return 'Libre';
      } else if (availableRooms > 0) {
        console.log(`⚠️ Statut admin: Partiellement occupé (${availableRooms}/${totalRooms})`);
        return 'Partiellement occupé';
      } else {
        console.log(`❌ Statut admin: Occupé (${availableRooms}/${totalRooms})`);
        return 'Occupé';
      }
    } else {
      // Location classique
      const activeRoommates = roommates.filter(roommate => 
        (roommate.property === property.title || roommate.property === property.id) && roommate.status === 'Actif'
      ).length;
      return activeRoommates > 0 ? 'Occupé' : 'Libre';
    }
  };

  // Calculer les chambres disponibles réelles
  const getRealAvailableRooms = () => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(roommate => 
        (roommate.property === property.title || roommate.property === property.id) && roommate.status === 'Actif'
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
    if (status === 'Libre') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (status === 'Occupé') {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (status === 'Partiellement occupé') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePhotoUpload}
            className="bg-white/90 hover:bg-white"
            title={t('properties.uploadPhoto')}
          >
            <Camera className="h-4 w-4" />
          </Button>
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
              {t('properties.mainTenant')}: {property.tenant}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
