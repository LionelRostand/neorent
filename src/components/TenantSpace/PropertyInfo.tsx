
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  Ruler, 
  Bed, 
  Euro,
  Car,
  Wifi,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PropertyInfoProps {
  propertyData: {
    title: string;
    address: string;
    type: string;
    surface: string;
    rooms: string;
    rent: number;
    charges: number;
    deposit: number;
    furnished: boolean;
    floor: string;
    elevator: boolean;
    parking: boolean;
    features: string[];
  };
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ propertyData }) => {
  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{propertyData.title}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {propertyData.address}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{propertyData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Surface</p>
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 mr-2" />
                    <span className="font-medium">{propertyData.surface}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre de pièces</p>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2" />
                    <span className="font-medium">{propertyData.rooms}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Étage</p>
                  <p className="font-medium">{propertyData.floor}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Équipements</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Meublé</span>
                    {propertyData.furnished ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ascenseur</span>
                    {propertyData.elevator ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Parking</span>
                    {propertyData.parking ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations financières */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Informations financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Loyer mensuel</p>
              <p className="text-2xl font-bold text-blue-600">{propertyData.rent}€</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Charges mensuelles</p>
              <p className="text-2xl font-bold text-orange-600">{propertyData.charges}€</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Dépôt de garantie</p>
              <p className="text-2xl font-bold text-green-600">{propertyData.deposit}€</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total mensuel (loyer + charges)</p>
            <p className="text-xl font-bold">{propertyData.rent + propertyData.charges}€</p>
          </div>
        </CardContent>
      </Card>

      {/* Caractéristiques */}
      <Card>
        <CardHeader>
          <CardTitle>Caractéristiques du logement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {propertyData.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="justify-center py-2">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyInfo;
