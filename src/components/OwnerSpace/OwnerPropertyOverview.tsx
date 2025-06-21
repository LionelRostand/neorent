
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Users, DollarSign, Eye } from 'lucide-react';

interface OwnerPropertyOverviewProps {
  ownerProfile: any;
}

const OwnerPropertyOverview: React.FC<OwnerPropertyOverviewProps> = ({ ownerProfile }) => {
  const properties = [
    {
      id: 1,
      name: 'Résidence Les Jardins',
      address: '123 Rue de la Paix, 75001 Paris',
      type: 'Appartement',
      units: 12,
      occupied: 11,
      revenue: '8,400€',
      status: 'active'
    },
    {
      id: 2,
      name: 'Villa Montmartre',
      address: '45 Avenue Victor Hugo, 75016 Paris',
      type: 'Maison',
      units: 1,
      occupied: 1,
      revenue: '2,800€',
      status: 'active'
    },
    {
      id: 3,
      name: 'Studio Centre Ville',
      address: '67 Boulevard Saint-Germain, 75005 Paris',
      type: 'Studio',
      units: 4,
      occupied: 3,
      revenue: '3,200€',
      status: 'maintenance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'vacant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'maintenance':
        return 'Maintenance';
      case 'vacant':
        return 'Vacant';
      default:
        return 'Inconnu';
    }
  };

  const getOccupancyRate = (occupied: number, total: number) => {
    return Math.round((occupied / total) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Aperçu des propriétés
          </CardTitle>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {property.type}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(property.status)}>
                    {getStatusText(property.status)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      Occupation
                    </div>
                    <span className="font-medium">
                      {property.occupied}/{property.units} ({getOccupancyRate(property.occupied, property.units)}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Revenus/mois
                    </div>
                    <span className="font-medium text-green-600">{property.revenue}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerPropertyOverview;
