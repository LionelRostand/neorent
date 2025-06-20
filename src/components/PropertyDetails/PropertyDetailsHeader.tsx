
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Bed, User } from 'lucide-react';

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
  creditImmobilier?: string;
  floor?: string;
  charges?: {
    electricity?: number;
    water?: number;
    heating?: number;
    maintenance?: number;
    insurance?: number;
    garbage?: number;
    internet?: number;
    taxes?: number;
  };
}

interface OccupancyInfo {
  status: string;
  availableRooms: number;
  totalRooms: number;
  occupiedRooms: number;
}

interface PropertyDetailsHeaderProps {
  property: Property;
  occupancyInfo: OccupancyInfo;
  occupantsCount: number;
}

const PropertyDetailsHeader: React.FC<PropertyDetailsHeaderProps> = ({ 
  property, 
  occupancyInfo, 
  occupantsCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {property.image && property.image !== '/placeholder.svg' ? (
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Home className="h-16 w-16 text-gray-400" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={property.locationType === 'Colocation' ? 'default' : 'secondary'}
            className={property.locationType === 'Colocation' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
          >
            {property.locationType}
          </Badge>
          <Badge 
            variant={occupancyInfo.status === 'Libre' ? 'secondary' : 'default'}
            className={
              occupancyInfo.status === 'Libre' ? 'bg-gray-100 text-gray-800' :
              occupancyInfo.status === 'Occupé' || occupancyInfo.status === 'Complet' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }
          >
            {occupancyInfo.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-5 w-5" />
            {property.address}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span> {property.type}
            </div>
            <div>
              <span className="font-medium">Surface:</span> {property.surface}
            </div>
            {property.floor && (
              <>
                <div>
                  <span className="font-medium">Étage:</span> {property.floor}
                </div>
                <div></div>
              </>
            )}
          </div>

          {property.locationType === 'Colocation' && (
            <div className="flex items-center text-gray-600">
              <Bed className="mr-2 h-5 w-5" />
              {occupancyInfo.availableRooms > 0 ? (
                <span className="text-green-600 font-medium">
                  {occupancyInfo.availableRooms} chambre(s) disponible(s)
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Toutes les chambres sont occupées
                </span>
              )}
              <span className="ml-1">/ {occupancyInfo.totalRooms} total</span>
            </div>
          )}

          {property.locationType === 'Location' && occupantsCount > 0 && (
            <div className="flex items-center text-green-600 font-medium">
              <User className="mr-2 h-5 w-5" />
              Appartement occupé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsHeader;
