
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Euro, Shield } from 'lucide-react';

interface PropertyInfoCardProps {
  propertyData: any;
  isRoommate: boolean;
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({ propertyData, isRoommate }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          {isRoommate ? 'Ma chambre' : 'Mon logement'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 block">Adresse</span>
                <span className="text-gray-600 text-sm">{propertyData.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-700 block">Type</span>
                <span className="text-gray-600 text-sm">{propertyData.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 bg-gray-400 rounded-sm"></div>
              <div>
                <span className="font-medium text-gray-700 block">Surface</span>
                <span className="text-gray-600 text-sm">{propertyData.surface}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Euro className="h-4 w-4 text-green-500" />
              <div>
                <span className="font-medium text-gray-700 block">Loyer</span>
                <span className="text-green-600 font-semibold">450€/mois</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Euro className="h-4 w-4 text-orange-500" />
              <div>
                <span className="font-medium text-gray-700 block">Charges</span>
                <span className="text-orange-600 font-semibold">150€/mois</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-purple-500" />
              <div>
                <span className="font-medium text-gray-700 block">Dépôt de garantie</span>
                <span className="text-purple-600 font-semibold">900€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-700 mb-3">Équipements</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {propertyData.features?.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Étage:</span>
              <span className="text-gray-600">{propertyData.floor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Ascenseur:</span>
              <Badge variant={propertyData.elevator ? 'default' : 'secondary'} className="text-xs">
                {propertyData.elevator ? 'Oui' : 'Non'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Parking:</span>
              <Badge variant={propertyData.parking ? 'default' : 'secondary'} className="text-xs">
                {propertyData.parking ? 'Oui' : 'Non'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyInfoCard;
