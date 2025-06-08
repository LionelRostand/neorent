
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, DollarSign, Users } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
        {property.image && property.image !== '/placeholder.svg' ? (
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Home className="h-12 w-12 text-gray-400" />
        )}
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900">{property.title}</h3>
            <div className="flex gap-2">
              <Badge 
                variant={property.locationType === 'Colocation' ? 'default' : 'secondary'}
                className={property.locationType === 'Colocation' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
              >
                {property.locationType}
              </Badge>
              <Badge 
                variant={property.status === 'Occupé' ? 'default' : 'secondary'}
                className={property.status === 'Occupé' ? 'bg-green-100 text-green-800' : ''}
              >
                {property.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="mr-1 h-4 w-4" />
            {property.address}
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Type: {property.type}</span>
            <span className="text-gray-600">Surface: {property.surface}</span>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center text-blue-600 font-semibold">
              <DollarSign className="mr-1 h-4 w-4" />
              {property.rent}/mois
            </div>
            {property.tenant && (
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="mr-1 h-4 w-4" />
                {property.tenant}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
