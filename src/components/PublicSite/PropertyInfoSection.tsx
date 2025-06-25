
import React from 'react';
import { 
  MapPin, 
  Euro, 
  Bed, 
  Bath, 
  Square, 
  Building
} from 'lucide-react';

interface PropertyInfoSectionProps {
  property: any;
}

export const PropertyInfoSection = ({ property }: PropertyInfoSectionProps) => {
  const getRoomInfo = (property: any) => {
    const rooms = property.locationType === 'Colocation' 
      ? property.totalRooms || 1
      : property.type === 'Studio' ? 1 : 2;
    const bathrooms = 1;
    return { rooms, bathrooms };
  };

  const roomInfo = getRoomInfo(property);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Informations générales
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {property.address}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {roomInfo.rooms} {property.locationType === 'Colocation' ? 'chambres' : 'pièces'}
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {roomInfo.bathrooms} SDB
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.surface}m²
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="font-medium text-blue-600">{property.type}</span>
            {property.locationType && (
              <span className="text-gray-500">• {property.locationType}</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tarification
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-gray-700">Loyer mensuel</span>
            <div className="flex items-center font-semibold text-lg text-green-600">
              <Euro className="h-4 w-4 mr-1" />
              {property.rent}€
            </div>
          </div>
          {property.charges && (
            <div className="text-sm text-gray-600">
              Charges comprises dans le loyer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
