
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Bed, Users } from 'lucide-react';

interface Property {
  type: string;
  surface: string;
  locationType: string;
}

interface OccupancyInfo {
  totalRooms: number;
  availableRooms: number;
}

interface PropertyConfigurationSectionProps {
  property: Property;
  occupancyInfo: OccupancyInfo;
  occupantsCount: number;
}

const PropertyConfigurationSection: React.FC<PropertyConfigurationSectionProps> = ({
  property,
  occupancyInfo,
  occupantsCount
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Configuration du bien</h3>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-medium">{property.type}</div>
              <div className="text-sm text-gray-600">{property.surface}</div>
            </div>
            
            {property.locationType === 'Colocation' && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Bed className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium">{occupancyInfo.totalRooms} chambres</div>
                <div className="text-sm text-gray-600">
                  {occupancyInfo.availableRooms} disponibles
                </div>
              </div>
            )}
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-medium">{occupantsCount} occupant(s)</div>
              <div className="text-sm text-gray-600">{property.locationType}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyConfigurationSection;
